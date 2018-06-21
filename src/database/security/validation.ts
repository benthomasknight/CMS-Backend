import {get} from 'config';

let defaultRules = [{
  regex: "^.{8,}$",
  message: "Your password must be at least 8 characters long"
}]

interface PasswordValidation {
  regex: string,
  message: string
}

export function passwordValidation(value: string) {
  let rules:Array<PasswordValidation> = (<any>get('security')).passwordRules || defaultRules;

  let messages:Array<string> = [];

  rules.forEach((v) => {
    let expression = new RegExp(v.regex);
    if(!expression.test(value)) {
      messages.push(v.message);
    }
  });

  if(messages.length > 0) {
    throw new Error(messages.join('\n'));
  }
}