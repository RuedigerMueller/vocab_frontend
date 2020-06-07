import { User } from 'src/app/models/user.model';

export const userTestData: User[] = [
    { id: 1, username: 'john', password: 'changeme', firstName: 'John', lastName: 'Miller', email: 'john@example.com' },
    { id: 2, username: 'chris', password: 'secret', firstName: 'Crhis', lastName: 'Myres', email: 'chris@example.com' },
    { id: 3, username: 'maria', password: 'guess', firstName: 'Maria', lastName: 'Muller', email: 'maria@example.com' },
];
