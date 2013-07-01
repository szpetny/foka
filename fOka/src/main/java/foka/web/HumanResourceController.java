package foka.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import foka.db.HumanResource;
import foka.db.HumanResourceDAO;

@Controller
public class HumanResourceController {

	@Autowired
	private HumanResourceDAO dao;
	
	@RequestMapping(value = "/hr", method = RequestMethod.POST)
	public @ResponseBody HumanResource add(@RequestBody HumanResource resource) {
		dao.add(resource);
		return resource;
	}

	@RequestMapping(value = "/hr/{name}/raise", method = RequestMethod.POST)
	public @ResponseBody HumanResource raise(@PathVariable String name) {
		HumanResource humanResource = new HumanResource();
		humanResource.setHumanName(name);
		dao.raise(humanResource);
		return humanResource;
	}

	@RequestMapping(value = "/hr/{name}/fall", method = RequestMethod.POST)
	public @ResponseBody HumanResource fall(@PathVariable String name) {
		HumanResource humanResource = new HumanResource();
		humanResource.setHumanName(name);
		dao.fall(humanResource);
		return humanResource;
	}
	
	@RequestMapping(value = "/hr/{name}/evaporate", method = RequestMethod.POST)
	public @ResponseBody String delete(@PathVariable String name) {
		dao.delete(name);
		return "OK";
	}


	@RequestMapping(value = "/hr/list", method = RequestMethod.GET)
	public @ResponseBody List<HumanResource> listAll() {
		return dao.listAll();
	}

	@RequestMapping(value = "/hr/reset", method = RequestMethod.POST)
	public @ResponseBody String reset() {
		dao.reset();
		return "OK";
	}

}
