type json2xmlOpts = {
    attributes_key?: boolean,
    header?: boolean
}

declare function json2xml(json: any, opts: json2xmlOpts): string;

export = json2xml;