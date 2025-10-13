import { type ITableField } from "./EstatesContainer";

export default function EstatesTableSkeleton({
  visibleTableFields,
  rows = 8,
}: {
  visibleTableFields: ITableField[];
  rows?: number;
}) {
  return (
    <>
      <style type="text/css">
        {`
                .table-container {
                  width: 100%;
                  overflow-x: auto;
                  padding-left: 1px;
                }

                .table {
                  width: 100%;
                  min-width: max-content;     
                  border-collapse: collapse;
                  font-size: 14px;
                  border-right: 1px solid #e0e0e0;
                  border-left: 1px solid #e0e0e0;
                  -webkit-user-select: none;
                  -ms-user-select: none;
                  user-select: none;  
                }

                .table th,
                .table td {
                  padding: 20px 15px;
                  text-align: start;
                  border-bottom: 1px solid #e0e0e0;
                }

                .table tbody td:nth-child(even) {
                  background-color: #f8f8f8;
                }

                .table thead th:nth-child(even) {
                  background-color: #ededed;
                }

                .table thead th {
                  position: sticky;
                  top: 0;
                  z-index: 2;
                }

                .table th {
                  background-color: #f2f2f2;
                }
              `}
      </style>
      <div className="mt-5 grid w-full">
        <div
          className="table-container custom-scrollbar border-primary-border"
          style={{ position: "relative" }}>
          <table className="table">
            <thead>
              <tr>
                <th>عملیات</th>
                {visibleTableFields.map((header) => {
                  if (!header.isVisible) return null;
                  return <th key={header.field}>{header.fieldName}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    <div className="h-6 w-10 animate-pulse rounded bg-neutral-200" />
                  </td>
                  {visibleTableFields.map((field) => {
                    if (!field.isVisible) return null;
                    return (
                      <td key={field.field}>
                        <div className="h-4 w-[140px] max-w-full animate-pulse rounded bg-neutral-200" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
