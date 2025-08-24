import dayjs from 'dayjs';

export class Util {
    public static getAge(birthdate: string | Date | undefined): number | undefined {
        if (!birthdate) return undefined;

        const birth = dayjs(birthdate);
        const today = dayjs();

        let age = today.year() - birth.year();

        if (
            today.month() < birth.month() ||
            (today.month() === birth.month() && today.date() < birth.date())
        ) {
            age--;
        }

        return age;
    }
}
