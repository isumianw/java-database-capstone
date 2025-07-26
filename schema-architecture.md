# Smart Clinic Architecture Documentation

## Section 1: Architecture Summary

The Smart Clinic Spring Boot application follows a clean layered architecture that separates responsibilities across multiple components. It supports both server-side rendered web views using Thymeleaf (for roles like Admin and Doctor) and RESTful APIs for modules such as Appointments, PatientDashboard, and PatientRecord. This dual approach ensures flexibility across web and mobile clients.

The application integrates with two different types of databases: MySQL and MongoDB. MySQL handles structured data like users, appointments, and roles using Spring Data JPA and relational schemas. MongoDB stores flexible, document-based data such as prescriptions using Spring Data MongoDB. All business logic is encapsulated in the service layer, ensuring controllers are clean and focused on handling requests. Data access is handled by repositories that abstract away the actual database queries, allowing for a consistent and testable architecture.

## Section 2: Numbered Flow of Data and Control

1. Users access the system via web dashboards (e.g., AdminDashboard) built with Thymeleaf, or through RESTful clients such as mobile apps or frontend modules like Appointments and PatientDashboard.
2. Based on the type of request, it is routed either to a Thymeleaf controller (for HTML views) or a REST controller (for JSON responses).
3. The controller processes the request by performing validations and then delegates the business logic to the service layer.
4. The service layer executes business rules (e.g., checking doctor availability), coordinates between different parts of the system, and calls the appropriate repository.
5. Repositories interact with the correct database: MySQL for relational data using JPA, or MongoDB for flexible document-based data using MongoDB repositories.
6. Data from the database is mapped into Java model classes using JPA entities (`@Entity`) or MongoDB documents (`@Document`), allowing the application to manipulate data in object form.
7. The controller receives the processed data and responds accordingly: either by rendering a Thymeleaf HTML page or returning a JSON response to the client.
