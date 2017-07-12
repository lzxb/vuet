declare type Vnode = {
  context: Object
}

declare type Dictionary<T> = { [key: string]: T }

declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  matched: Array<Object>;
  redirectedFrom?: string;
  meta?: any;
}

declare type RuleOptions = {
  path: string;
  name?: string;
}

declare type DirectiveParams =   {
  modifiers: {
    window?: boolean;
    self?: boolean;
  },
  value: {
    path: string;
    name?:string;
    self?: {
      x: number,
      y: number
    },
    window?: {
      x: number,
      y: number
    }
  }
}