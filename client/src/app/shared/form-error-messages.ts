export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}
export const FormErrorMessages = [
  new ErrorMessage('title', 'required', 'Ein Fachtitel muss angegeben werden'),
  new ErrorMessage('title', 'minlength', 'Der Fachtitel muss mindestens 3 Zeichen enthalten'),
  new ErrorMessage('title', 'maxlength', 'Der Fachtitel darf höchstens 50 Zeichen haben'),

  new ErrorMessage('start_at', 'required', 'Ein Startdatum muss angegeben werden'),
  new ErrorMessage('start_at', 'min', 'Das Startdatum muss in der Zukunft liegen'),
  new ErrorMessage('end_at', 'required', 'Ein Enddatum muss angegeben werden'),
  new ErrorMessage('end_at', 'min', 'Das Enddatum muss vor dem Startdatum liegen'),
  new ErrorMessage('end_at', 'endBeforeStart', 'Das Enddatum muss nach dem Startdatum liegen'),
  new ErrorMessage('price', 'min', 'Der Preis muss positiv sein'),

  new ErrorMessage('email', 'required', 'Eine E-Mail-Adresse muss angegeben werden'),
  new ErrorMessage('email', 'pattern', 'Die E-Mail-Adresse ist ungültig'),
  new ErrorMessage('password', 'required', 'Ein Passwort muss angegeben werden'),
  new ErrorMessage('password', 'minlength', 'Das Passwort muss mindestens 5 Zeichen enthalten'),


];
