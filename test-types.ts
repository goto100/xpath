// Compile-only tests for xpath.d.ts, checked by `yarn test` (tsc -p tsconfig.types.json).
// Nothing here runs. A typed assignment checks that a type is accepted;
// `@ts-expect-error` checks that something must not compile.
import * as xpath from './xpath';

declare const doc: Document;
declare const nsResolver: XPathNSResolver;

// select(), select1()
const many: xpath.SelectReturnType = xpath.select('//a', doc);
const manyExplicit: xpath.SelectReturnType = xpath.select('//a', doc, false);
const single: xpath.SelectSingleReturnType = xpath.select('//a', doc, true);
const first: xpath.SelectedValue = xpath.select1('//a', doc);
// @ts-expect-error a single result isn't an array
const notAnArray: Node[] = xpath.select('//a', doc, true);
// @ts-expect-error the expression is a string
xpath.select(1, doc);

// selectWithResolver()
const withResolver: xpath.SelectReturnType = xpath.selectWithResolver('//a', doc, nsResolver);
const withoutResolver: xpath.SelectReturnType = xpath.selectWithResolver('//a', doc);
const withResolverSingle: xpath.SelectSingleReturnType = xpath.selectWithResolver('//a', doc, null, true);

// useNamespaces()
const selectNs: xpath.XPathSelect = xpath.useNamespaces({ x: 'urn:x' });
const nsMany: xpath.SelectReturnType = selectNs('//x:a', doc);
const nsSingle: xpath.SelectSingleReturnType = selectNs('//x:a', doc, true);
// @ts-expect-error namespace URIs are strings
xpath.useNamespaces({ x: 1 });

// Type guards
const selected = xpath.select('//a', doc);
if (xpath.isArrayOfNodes(selected)) {
    const nodes: Node[] = selected;
}
const value = xpath.select1('//a', doc);
// @ts-expect-error not narrowed yet
const notNarrowed: Element = value;
if (xpath.isNodeLike(value)) {
    const node: Node = value;
}
if (xpath.isElement(value)) {
    const element: Element = value;
}
if (xpath.isAttribute(value)) {
    const attribute: Attr = value;
}
if (xpath.isTextNode(value)) {
    const text: Text = value;
}
if (xpath.isCDATASection(value)) {
    const cdata: CDATASection = value;
}
if (xpath.isProcessingInstruction(value)) {
    const pi: ProcessingInstruction = value;
}
if (xpath.isComment(value)) {
    const comment: Comment = value;
}
if (xpath.isDocumentNode(value)) {
    const document: Document = value;
}
if (xpath.isDocumentTypeNode(value)) {
    const doctype: DocumentType = value;
}
if (xpath.isDocumentFragment(value)) {
    const fragment: DocumentFragment = value;
}

// parse() and XPathEvaluator
const evaluator: xpath.XPathEvaluator = xpath.parse('count(//a)');
const options: xpath.XPathEvaluateOptions = {
    node: doc,
    namespaces: { x: 'urn:x' },
    variables: { v: 1 },
    position: 1,
    size: 2,
    isHtml: true,
    allowAnyNamespaceForNoPrefix: true,
};
const asBoolean: boolean = evaluator.evaluateBoolean(options);
const asNumber: number = evaluator.evaluateNumber(options);
const asString: string = evaluator.evaluateString(options);
const selectedNodes: Node[] = evaluator.select({ node: doc });
const selectedNode: Node | undefined = evaluator.select1();
// @ts-expect-error not an option
evaluator.evaluate({ nodes: doc });

// XPathEvaluationResult and XPathNodeSet
const result: xpath.XPathEvaluationResult = evaluator.evaluate();
const resultBoolean: boolean = result.booleanValue();
const resultNumber: number = result.numberValue();
const resultString: string = result.stringValue();
// @ts-expect-error toArray() is only on node sets
result.toArray();
const nodeSet: xpath.XPathNodeSet = evaluator.evaluateNodeSet({ node: doc });
const size: number = nodeSet.size;
const firstNode: Node | null = nodeSet.first();
const allNodes: Node[] = nodeSet.toArray();
const nodeSetIsResult: xpath.XPathEvaluationResult = nodeSet;

// Namespace resolvers
evaluator.evaluate({ namespaces: (prefix: string, node: Node) => (prefix === 'x' ? 'urn:x' : null) });
evaluator.evaluate({ namespaces: { getNamespace: (prefix: string) => undefined } });

// Variable resolvers
evaluator.evaluate({ variables: { s: 'a', n: 1, b: true, nodes: [doc], none: null } });
evaluator.evaluate({ variables: (name: string, namespace: string | null) => (name === 'v' ? 1 : undefined) });
evaluator.evaluate({ variables: { getVariable: (name: string) => doc } });
// @ts-expect-error variable values are XPath values
evaluator.evaluate({ variables: { bad: Symbol('x') } });

// Custom functions and function resolvers
const square: xpath.XPathFunction = (context, value) => {
    const contextNode: Node = context.contextNode;
    return value.numberValue() * value.numberValue();
};
evaluator.evaluate({ functions: { square } });
evaluator.evaluate({ functions: (name: string, namespace: string | null) => (name === 'square' ? square : null) });
evaluator.evaluate({ functions: { getFunction: (name: string) => undefined } });
// @ts-expect-error custom functions return XPath values
evaluator.evaluate({ functions: { bad: () => Symbol('x') } });
