module fu.edu.sba301.core {
    requires java.naming;
    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires com.h2database;

    exports fu.edu.sba301.core.domain;
    exports fu.edu.sba301.core.service;

    // Hibernate creates entities and accesses their persistent fields reflectively.
    opens fu.edu.sba301.core.domain to org.hibernate.orm.core;
}
