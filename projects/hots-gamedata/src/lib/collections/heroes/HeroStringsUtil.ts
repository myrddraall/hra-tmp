const FirstNumberExp = /[\d]+/;
const CostExp = /^<.*?>(.*?): ([\d]+)/;

export class HeroStringsUtil {

    private static parseSingleNumber(description: string): number | undefined {
        if (!description) {
            return;
        }
        const match = description.match(FirstNumberExp);
        const num = match ? match[0] || '' : undefined;
        return parseFloat(num) || undefined;
    }

    private static parseCost(description: string): number | undefined {
        if (!description) {
            return;
        }
        const match = description.match(CostExp);
        const num = match ? match[2] || '' : undefined;
        return parseFloat(num) || undefined;
    }

    public static parseCooldown(description: string): number | undefined {
        return HeroStringsUtil.parseSingleNumber(description);
    }

    public static parseEnergyCost(description: string): number | undefined {
        return HeroStringsUtil.parseCost(description);
    }

    public static parseLifeCost(description: string): number | undefined {
        return HeroStringsUtil.parseCost(description);
    }

    public static parseEnergyType(description: string): string | undefined {
        if (!description) {
            return;
        }
        const match = description.match(CostExp);
        return match ? match[1] || '' : undefined;;

    }

    public static normalizeString(name: string): string {
        return name?.replace(/[ÀÁÂÃÄÅ]/g, "A")
            .replace(/[àáâãäå]/g, "a")
            .replace(/[ÈÉÊËĒĔĖĘĚ]/g, "E")
            .replace(/[èéêëēĕėęě]/g, "e")
            .replace(/[ÌÍÎÏĨĬĮİ]/g, "I")
            .replace(/[ìíîïĩīĭį]/g, "i")
            .replace(/[ÒÓÔÕÖŌŎŐ]/g, "O")
            .replace(/[òóôõöōŏő]/g, "o")
            .replace(/[ÙÚÛÜŨŪŬŮŰ]/g, "U")
            .replace(/[ùúûüũūŭůű]/g, "u");
        // .replace(/[^a-z0-9 ]/gi, replace);
    }

    public static normalizeStringNoSpace(name: string, spaceReplacement: string = ''): string {
        return this.normalizeString(name)
            .replace(/[^a-z0-9 \-]/gi, '')
            .replace(/[^a-z0-9]/gi, spaceReplacement);
    }
}