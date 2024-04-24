import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailMask',
  standalone:true,
})
export class EmailMaskPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const [username, domain] = value.split('@');
    const maskedUsername = username.slice(0, -5) + '****'; // Mask the username

    return `${maskedUsername}@${domain}`;
  }
}
