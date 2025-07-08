interface Contact {
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
  photo: Photo | null;
}