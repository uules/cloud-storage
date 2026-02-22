export interface CreateShareBody {
  Body: {
    label: string;
    expiresInDays: number;
  };
}

export interface RevokeShareParams {
  Params: { id: string };
}
