import { T } from "@tldraw/tldraw";


export declare type Expand<T> = T extends infer O ? {
  [K in keyof O]: O[K];
} : never;

export declare type ShapePropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
  [K in keyof Config]: T.TypeOf<Config[K]>;
}>;