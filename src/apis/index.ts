import { httpsGet } from "../utils";

export const npmUrl = 'https://www.npmjs.com';

export const searchNpmPackage = async (keyword: string): Promise<SearchNpmPackageModel[]> => {
    const res = await httpsGet({
        url: `${npmUrl}/search?q=${keyword}`,
        header: {
            "x-spiferack": "1"
        }
    });
    return JSON.parse(res).objects.map((item: { package: any; }) => item.package);
};

export const getPackageDirectory = async (name: string, version: string): Promise<any> => {
    const res = await httpsGet({ url: `${npmUrl}/package/${name}/v/${version}/index` });
    return JSON.parse(res);
};

export const getPackageVersions = async (name: string, version: string): Promise<{ versionsDownloads: Record<string, number>; }> => {
    const res = await httpsGet({
        url: `${npmUrl}/package/${name}/v/${version}`,
        header: {
            "x-spiferack": "1"
        }
    });
    return JSON.parse(res);
};

export interface SearchNpmPackageModel {
    name: string,
    scope: string,
    version: string,
    description: string;
    keywords: string[],
    date: {
        ts: Number,
        rel: string;
    },
    links: {
        npm: string,
        homepage: string,
        repository: string,
        bugs: string;
    },
    author: {
        name: string;
    },
    publisher: {
        name: string,
        avatars: {
            small: string,
            medium: string,
            large: string;
        },
        created: {
            ts?: Number,
            rel: string;
        },
        email: string;
    },
    keywordsTruncated: boolean;
}

export interface PakageDirectoryModel {
    files: PakageDirectoryModel[];
    name: string,
    type: string,
    hash?: string,
    size?: number,
    time?: string;
}