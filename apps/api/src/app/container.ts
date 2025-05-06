import { Container } from "inversify";
import { AuthService } from "./modules/customers/auth/auth.service";
import { CustomerService } from "./modules/customers/customers.service";
import { NotesService } from "./modules/notes/notes.service";
import { Database } from "./modules/storage/database";

export const servicesContainer: Container = new Container();

servicesContainer.bind(Database).toSelf().inSingletonScope();
servicesContainer.bind(CustomerService).toSelf().inSingletonScope();
servicesContainer.bind(AuthService).toSelf().inSingletonScope();
servicesContainer.bind(NotesService).toSelf().inSingletonScope();
