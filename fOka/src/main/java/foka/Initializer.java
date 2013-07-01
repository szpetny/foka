package foka;

import javax.servlet.ServletContext;

import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

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
class Config  {
	
}