import { tableLayout } from "../table.js";

function makeTable(dataRows: number): string {
  const header = "| col1 | col2 |";
  const separator = "| ---- | ---- |";
  const row = "| data | data |";
  return [header, separator, ...Array(dataRows).fill(row)].join("\n");
}

describe("tableLayout template class selection", () => {
  it("applies table-large for 4 data rows", () => {
    const output = tableLayout.template({ heading: "T", tableMarkdown: makeTable(4) });
    expect(output).toContain("table-center table-large");
  });

  it("applies no size class for 5 data rows", () => {
    const output = tableLayout.template({ heading: "T", tableMarkdown: makeTable(5) });
    expect(output).toContain("_class: table-center");
    expect(output).not.toContain("table-large");
    expect(output).not.toContain("table-small");
    expect(output).not.toContain("table-tiny");
  });

  it("applies table-small for 6 data rows", () => {
    const output = tableLayout.template({ heading: "T", tableMarkdown: makeTable(6) });
    expect(output).toContain("table-center table-small");
  });

  it("applies table-tiny for 7 data rows", () => {
    const output = tableLayout.template({ heading: "T", tableMarkdown: makeTable(7) });
    expect(output).toContain("table-center table-tiny");
  });

  it("applies table-tiny for 8 data rows", () => {
    const output = tableLayout.template({ heading: "T", tableMarkdown: makeTable(8) });
    expect(output).toContain("table-center table-tiny");
  });
});
