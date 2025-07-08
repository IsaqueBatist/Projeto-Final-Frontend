import { Address } from './Address';
import { Category } from './Category';
import { Email } from './Email';
import { Group } from './Group';
import { Phone } from './Phone';

export interface Contact {
  id: number;
  firstname: string;
  lastname: string;
  birthDate: string;
  isFavorite: boolean;
  emails: Email[];
  phones: Phone[];
  addresses: Address[];
  groups: Group[];
  categories: Category[];
  note: string;
}
