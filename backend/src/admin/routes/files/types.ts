export interface ListFilesQuery {
  Querystring: { path?: string }
}

export interface DeleteFileBody {
  Body: { path: string }
}

export interface RenameFileBody {
  Body: { path: string; newName: string }
}

export interface MoveFileBody {
  Body: { path: string; destinationPath: string }
}