package foka.db;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Repository
public class HumanResourceDAO {

	@Autowired
	private JedisPool jedisPool;
	
	public void add(HumanResource humanResource) {
		Jedis jedis = jedisPool.getResource();
		jedis.set(humanResource.getHumanName(), "0");
		humanResource.setFokCount(0);
		jedisPool.returnResource(jedis);
	}
	
	public void raise(HumanResource humanResource) {
		Jedis jedis = jedisPool.getResource();
		humanResource.setFokCount(jedis.incr(humanResource.getHumanName()));
		jedisPool.returnResource(jedis);
	}
	
	public void fall(HumanResource humanResource) {
		Jedis jedis = jedisPool.getResource();
		humanResource.setFokCount(jedis.decr(humanResource.getHumanName()));
		jedisPool.returnResource(jedis);
	}

	public List<HumanResource> listAll() {
		Jedis jedis = jedisPool.getResource();
		List<HumanResource> all = new ArrayList<HumanResource>();
		for (String key : jedis.keys("*")) {
			HumanResource resource = new HumanResource();
			resource.setHumanName(key);
			resource.setFokCount(Long.parseLong(jedis.get(key)));
			all.add(resource);
		}
		jedisPool.returnResource(jedis);
		
		return all;
	}
	
	public void delete(String humanName) {
		Jedis jedis = jedisPool.getResource();
		jedis.del(humanName);
		jedisPool.returnResource(jedis);
	}

	public void reset() {
		Jedis jedis = jedisPool.getResource();
		for (String key : jedis.keys("*")) {
			jedis.set(key, "0");
		}
		jedisPool.returnResource(jedis);
	}
}
