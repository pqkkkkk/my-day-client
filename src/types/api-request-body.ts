
export interface CreateListRequest{
    listTitle: string;
    listDescription?: string;
    listCategory: 'PERSONAL' | 'WORK' | 'STUDY' | 'OTHER';
    color?: string;
    username: string;
}