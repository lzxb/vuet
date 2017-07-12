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