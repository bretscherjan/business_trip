package ch.clip.trips;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class SpringWebConfig implements WebMvcConfigurer {
	/**
	 * CORS - Policy - from known Servers
	 */
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// Allgemeine CORS-Konfiguration für alle Endpunkte
		registry.addMapping("/**")
			.allowedOrigins("http://localhost:3000", "http://localhost:8080")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true)
			.maxAge(3600);
			
		// Spezifische Konfigurationen (falls benötigt)
		registry.addMapping("/trips/**")
			.allowedOrigins("http://localhost:3000", "http://localhost:8080")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true)
			.maxAge(3600);
			
		registry.addMapping("/meeting/**")
			.allowedOrigins("http://localhost:3000", "http://localhost:8080")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true)
			.maxAge(3600);
			
		registry.addMapping("/PackingList/**")
			.allowedOrigins("http://localhost:3000", "http://localhost:8080")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true)
			.maxAge(3600);
	}
}
