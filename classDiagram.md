```mermaid
classDiagram
    direction TB

    class User {
        +number id
        +string username
        +string password
        +enum status
    }

    class Client {
        +number id
        +string name
        +enum status
    }

    class Project {
        +number id
        +string name
        +enum status
        +number clientId
    }

    class Task {
        +number id
        +string description
        +enum status
        +number projectId
    }

    Client "1" o-- "0..*" Project : asocia
    Project "1" *-- "0..*" Task : contiene