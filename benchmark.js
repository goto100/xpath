const { DOMParser } = require('@xmldom/xmldom');
const xpath = require('./xpath');

const xml = `<root xmlns:ns1="http://example.com/ns1" xmlns:ns2="http://example.com/ns2" xmlns:ns3="http://example.com/ns3" xmlns:ns4="http://example.com/ns4" xmlns:ns5="http://example.com/ns5" ID="id12345" Version="1.0">
  <ns1:Item1>
    <ns1:SubItem1>Value1</ns1:SubItem1>
    <ns1:SubItem2>Value2</ns1:SubItem2>
  </ns1:Item1>
  <ns2:Item2>
    <ns2:SubItem1>Value3</ns2:SubItem1>
    <ns2:SubItem2>Value4</ns2:SubItem2>
  </ns2:Item2>
  <ns3:Item3>
    <ns3:SubItem1Target>Value5</ns3:SubItem1Target>
    <ns3:SubItem2>Value6</ns3:SubItem2>
  </ns3:Item3>
  <ns4:Item4>
    <ns4:SubItem1>Value7</ns4:SubItem1>
    <ns4:SubItem2>Value8</ns4:SubItem2>
  </ns4:Item4>
  <ns5:Item5>
    <ns5:SubItem1>Value9</ns5:SubItem1>
    <ns5:SubItem2>Value10</ns5:SubItem2>
  </ns5:Item5>
</root>`;

const doc = new DOMParser().parseFromString(xml);
const ITERATIONS = 100000;

const start = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  xpath.select("//*[local-name()='SubItem1Target']", doc);
}
const end = Date.now();

console.log(`Benchmark completed in ${(end - start).toFixed(2)} milliseconds for ${ITERATIONS} iterations.`
);
