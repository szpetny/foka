package foka.db;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.Tuple;

@Repository
public class HumanResourceDAO {

	@Autowired
	private JedisPool jedisPool;
	private static final String HUMAN_RESOURCES = "humanResources";
	
	public void add(HumanResource humanResource) {
		Jedis jedis = jedisPool.getResource();
		
		jedis.zadd(HUMAN_RESOURCES, 0, humanResource.getHumanName());
		humanResource.setFokCount(0);
		jedisPool.returnResource(jedis);
	}
	
	public void raise(HumanResource humanResource) {
		Jedis jedis = jedisPool.getResource();
		jedis.zincrby(HUMAN_RESOURCES, humanResource.getFokCount() + 1 ,humanResource.getHumanName());
		humanResource.setFokCount(jedis.zscore(HUMAN_RESOURCES, humanResource.getHumanName()).longValue());
		jedisPool.returnResource(jedis);
	}
	
	public void fall(HumanResource humanResource) {
		Jedis jedis = jedisPool.getResource();
		jedis.zincrby(HUMAN_RESOURCES, humanResource.getFokCount() - 1 ,humanResource.getHumanName());
		humanResource.setFokCount(jedis.zscore(HUMAN_RESOURCES, humanResource.getHumanName()).longValue());
		jedisPool.returnResource(jedis);
	}

	public List<HumanResource> listAll() {
		Jedis jedis = jedisPool.getResource();
		List<HumanResource> all = new ArrayList<HumanResource>();
		for (Tuple tuple : jedis.zrevrangeByScoreWithScores(HUMAN_RESOURCES, Double.MAX_VALUE, 0)) {
			HumanResource resource = new HumanResource();
			resource.setHumanName(tuple.getElement());
			resource.setFokCount((long)tuple.getScore());
			all.add(resource);
		}
		jedisPool.returnResource(jedis);
		
		return all;
	}
	
	public void delete(String humanName) {
		Jedis jedis = jedisPool.getResource();
		jedis.zrem(HUMAN_RESOURCES, humanName);
		jedisPool.returnResource(jedis);
		deleteComments(humanName);
	}

	public void reset() {
		Jedis jedis = jedisPool.getResource();
		for (String key : jedis.zrange(HUMAN_RESOURCES, 0, jedis.zcount(HUMAN_RESOURCES, 0, Double.MAX_VALUE).intValue())) {
			jedis.zrem(HUMAN_RESOURCES, key);
			jedis.zadd(HUMAN_RESOURCES, 0, key);
		}
		jedisPool.returnResource(jedis);
	}
	
	public String updateComments(String humanName, String comment) {
		Jedis jedis = jedisPool.getResource();
		if (jedis.exists(humanName)) {
			jedis.append(humanName, comment);
		}
		else {
			jedis.set(humanName, comment);
		}
		jedisPool.returnResource(jedis);
		return jedis.get(humanName);
	}
	
	private void deleteComments(String humanName) {
		Jedis jedis = jedisPool.getResource();
		jedis.del(humanName);
		jedisPool.returnResource(jedis);
	}
}
