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

    public static chunkArray<T>(arr: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }
}
