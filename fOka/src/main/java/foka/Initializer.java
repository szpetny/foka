package foka;

import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import redis.clients.jedis.JedisPool;

public class Initializer implements WebApplicationInitializer {

	private final Logger logger = LoggerFactory.getLogger(Initializer.class);

	public void onStartup(ServletContext servletContext) throws ServletException {
		logger.info("Starting fOka");
		AnnotationConfigWebApplicationContext mvcContext = new AnnotationConfigWebApplicationContext();
		mvcContext.getEnvironment().setActiveProfiles("production");
		mvcContext.register(Config.class);
		
		ServletRegistration.Dynamic dispatcher = servletContext.addServlet("springMvcDispatcher", 
				new DispatcherServlet(mvcContext));
		dispatcher.setLoadOnStartup(1);
		dispatcher.addMapping("/api/*");
		
		servletContext.addListener(new ContextLoaderListener(mvcContext));
	}

}

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "foka")
@Profile("production")
class Config extends WebMvcConfigurerAdapter {

	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		converters.add(converter);
	}

	@Bean
	public JedisPool jedisPool() {
		return new JedisPool("localhost", 6379);
	}
	
}