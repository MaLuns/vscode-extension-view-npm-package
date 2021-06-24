import { httpsGet } from "../utils";

const jsdelivrUrl = 'https://data.jsdelivr.com/v1/package/npm/';
const npmUrl = 'https://www.npmjs.com';

export const searchNpmPackage = async (keyword: string): Promise<SearchNpmPackageModel[]> => {
    const res = await httpsGet({
        url: npmUrl + '/search?q=' + keyword,
        header: {
            "x-spiferack": "1"
        }
    });
    return JSON.parse(res).objects.map((item: { package: any }) => item.package);
};

export const getPackageDirectory = async (keyword: string): Promise<PakageDirectoryModel[]> => {
    const res = await httpsGet({ url: jsdelivrUrl + keyword });
    return JSON.parse(res).files;
};

export const getPackageVersions = async (keyword: string): Promise<string[]> => {
    const res = await httpsGet({ url: jsdelivrUrl + keyword });
    return JSON.parse(res).versions;
};

export interface SearchNpmPackageModel {
    name: string,
    scope: string,
    version: string,
    description: string
    keywords: string[],
    date: {
        ts: Number,
        rel: string
    },
    links: {
        npm: string,
        homepage: string,
        repository: string,
        bugs: string
    },
    author: {
        name: string
    },
    publisher: {
        name: string,
        avatars: {
            small: string,
            medium: string,
            large: string
        },
        created: {
            ts?: Number,
            rel: string
        },
        email: string
    },
    keywordsTruncated: boolean
}

export interface PakageDirectoryModel {
    files: PakageDirectoryModel[]
    name: string,
    type: string,
    hash?: string,
    size?: number,
    time?: string
}