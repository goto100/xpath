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
const first: xpath.SelectSingleReturnType = xpath.select1('//a', doc);
// select() gives nodes or a scalar: never a single node, never null
const manyExact: Node[] | xpath.ScalarValue = xpath.select('//a', doc);
// select1() gives a node, a scalar, or null when nothing matched: never undefined
const firstExact: Node | xpath.ScalarValue | null = xpath.select1('//a', doc);
// @ts-expect-error select1() can return null
const firstNonNull: Node | xpath.ScalarValue = xpath.select1('//a', doc);
// @ts-expect-error select1() can return null, not undefined
const firstUndefined: Node | xpath.ScalarValue | undefined = xpath.select1('//a', doc);
// @ts-expect-error a single result isn't an array
const notAnArray: Node[] = xpath.select('//a', doc, true);
// SelectedValue is deprecated but still exported, and select1() results fit it
const legacyValue: xpath.SelectedValue = null;
const legacyFirst: xpath.SelectedValue = xpath.select1('//a', doc);
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

// evaluate() and XPathResult
const evaluated: xpath.XPathResult = xpath.evaluate('string(//a)', doc, null, xpath.XPathResult.STRING_TYPE, null);
const evaluatedString: string = evaluated.stringValue;
const evaluatedType: number = evaluated.resultType;
const singleNode: Node | null = evaluated.singleNodeValue;
const nextNode: Node | null = evaluated.iterateNext();
const snapshotNode: Node | null = evaluated.snapshotItem(0);
// @ts-expect-error iterateNext() can return null
const nextNonNull: Node = evaluated.iterateNext();
// @ts-expect-error snapshotItem() returns null, not undefined, when there's no node
const snapshotUndefined: Node | undefined = evaluated.snapshotItem(0);
const snapshotLength: number = evaluated.snapshotLength;
const reused: xpath.XPathResult = xpath.evaluate('//a', doc, nsResolver, xpath.XPathResult.ANY_TYPE, evaluated);
const stringType: 2 = xpath.XPathResult.STRING_TYPE;
const firstOrderedType: 9 = xpath.XPathResult.FIRST_ORDERED_NODE_TYPE;
declare const unknownValue: unknown;
if (unknownValue instanceof xpath.XPathResult) {
    const narrowedResult: xpath.XPathResult = unknownValue;
}
// @ts-expect-error results come from evaluate(); the class isn't constructed directly
new xpath.XPathResult();
// @ts-expect-error the type constants are static, not on results
evaluated.STRING_TYPE;
// @ts-expect-error iterateNext() is a method of results, not of the class
xpath.XPathResult.iterateNext();

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
// The guards accept any value, including null, undefined and nodes from the DOM
declare const anything: unknown;
if (xpath.isElement(anything)) {
    const fromUnknown: Element = anything;
}
if (xpath.isArrayOfNodes(anything)) {
    const nodesFromUnknown: Node[] = anything;
}
declare const element: Element;
if (xpath.isElement(element.parentNode)) {
    const parentElement: Element = element.parentNode;
}
const nullIsNode: boolean = xpath.isNodeLike(null) || xpath.isNodeLike(undefined);
const documentIsArray: boolean = xpath.isArrayOfNodes(doc);

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
const selectedNode: Node | null = evaluator.select1();
// @ts-expect-error select1() can return null
const selectedNonNull: Node = evaluator.select1();
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
