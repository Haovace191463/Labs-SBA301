package com.library.config;

import org.hibernate.SessionFactory;
import org.hibernate.boot.Metadata;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class HibernateUtil {
    private static StandardServiceRegistry registry;
    private static SessionFactory sessionFactory;

    private HibernateUtil() {
        // Private constructor to prevent instantiation
    }

    public static synchronized SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            try {
                StandardServiceRegistryBuilder registryBuilder = new StandardServiceRegistryBuilder();
                registryBuilder.configure("hibernate.cfg.xml");

                // Load base db.properties if available
                Properties dbProps = new Properties();
                try (InputStream input = HibernateUtil.class.getClassLoader().getResourceAsStream("db.properties")) {
                    if (input != null) {
                        dbProps.load(input);
                    }
                } catch (Exception e) {
                    System.err.println("Note: db.properties could not be loaded: " + e.getMessage());
                }

                // Load untracked local override db.local.properties if present (classpath or working dir)
                try (InputStream localInput = HibernateUtil.class.getClassLoader().getResourceAsStream("db.local.properties")) {
                    if (localInput != null) {
                        dbProps.load(localInput);
                    } else {
                        java.io.File localFile = new java.io.File("db.local.properties");
                        if (localFile.exists()) {
                            try (java.io.FileInputStream fis = new java.io.FileInputStream(localFile)) {
                                dbProps.load(fis);
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Note: db.local.properties could not be loaded: " + e.getMessage());
                }

                Map<String, Object> settings = new HashMap<>();

                // Check Environment Variables, System Properties, or db.properties
                String dbUrl = getProperty("db.url", "DB_URL", dbProps);
                if (dbUrl != null && !dbUrl.isBlank()) {
                    settings.put("hibernate.connection.url", dbUrl);
                }

                String dbUser = getProperty("db.user", "DB_USER", dbProps);
                if (dbUser != null && !dbUser.isBlank()) {
                    settings.put("hibernate.connection.username", dbUser);
                }

                String dbPassword = getProperty("db.password", "DB_PASSWORD", dbProps);
                if (dbPassword != null && !dbPassword.isBlank()) {
                    settings.put("hibernate.connection.password", dbPassword);
                }

                if (!settings.isEmpty()) {
                    registryBuilder.applySettings(settings);
                }

                registry = registryBuilder.build();
                MetadataSources sources = new MetadataSources(registry);
                sources.addAnnotatedClass(com.library.entity.Student.class);
                sources.addAnnotatedClass(com.library.entity.Book.class);
                Metadata metadata = sources.getMetadataBuilder().build();
                sessionFactory = metadata.getSessionFactoryBuilder().build();

            } catch (Exception e) {
                System.err.println("Initial SessionFactory creation failed: " + e);
                if (registry != null) {
                    StandardServiceRegistryBuilder.destroy(registry);
                }
                throw new ExceptionInInitializerError(e);
            }
        }
        return sessionFactory;
    }

    private static String getProperty(String propKey, String envKey, Properties props) {
        // 1. JVM System property (e.g. -Ddb.url=...)
        String val = System.getProperty(propKey);
        if (val != null && !val.isBlank()) {
            return val;
        }
        // 2. Environment variable (e.g. DB_URL=...)
        val = System.getenv(envKey);
        if (val != null && !val.isBlank()) {
            return val;
        }
        // 3. Properties file
        return props.getProperty(propKey);
    }

    public static synchronized void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
        }
        if (registry != null) {
            StandardServiceRegistryBuilder.destroy(registry);
        }
        sessionFactory = null;
        registry = null;
    }
}
