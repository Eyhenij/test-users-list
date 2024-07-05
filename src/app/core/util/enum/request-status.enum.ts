export enum RequestStatusEnum {
    INITIAL = 'initial',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error'
}

export type RequestStatus =
    | RequestStatusEnum.INITIAL
    | RequestStatusEnum.PENDING
    | RequestStatusEnum.SUCCESS
    | RequestStatusEnum.ERROR;
