"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Edit, Eye, RefreshCcw, Search, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import UIButton from "../Button/Button";
import Field from "../InputField/Field";

interface TableProps<T> {
   tableName?: string;
   data: T[];
   columns: any[];
   onRowClick?: (item: T) => void;
   onViewClick?: (item: T) => void;
   onEditClick?: (item: T) => void;
   keyField?: string;
   selectKey?: string;
   statusField?: string;
   statusStyles?: Record<string, string>;
   defaultStatusStyles?: {
      active: string;
      inactive: string;
      delivered: string;
      picking_up: string;
      on_way: string;
   };
   href?: string;
   actions?: boolean;
   eye?: boolean;
   edit?: boolean;
   trash?: boolean;
   isLoading?: boolean;
   setId?: (id: string) => void;
   setSelectedRowData?: (data: any) => void;
   maxTextLength?: number;
   deleteFunctions?: () => void;
   tableStyle?: React.CSSProperties;
   theadStyle?: React.CSSProperties;
   trStyle?: React.CSSProperties;
   tbodyStyle?: React.CSSProperties;
   isSelect?: boolean;
   currentPage?: number;
   setCurrentPage: (page: number) => void;
   setStatusFilter?: (key: string, value: string | number) => void;
   pageLimit?: number;
   dataLength?: number;
   IsModalOpen?: boolean;
   HandleChangeModal?: Dispatch<SetStateAction<boolean>>;
   Modal?: ReactNode;
   isModal?: boolean;
   ModalName?: string;
   BtnName?: string;
   isBtn?: boolean;
   BtnClick?: () => void;
   tableWidth?: string;
   onSearchChange?: (key: string, value: string) => void;
   numberOfPages?: number;
   loadingLength?: number;
   CustomSearchField?: ReactNode;
}

const shimmerLight = {
   backgroundImage: "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
   backgroundSize: "200% 100%",
   backgroundRepeat: "no-repeat",
   animation: "shimmer 1.5s infinite",
   borderRadius: "4px",
};

const Table = <T extends Record<string, any>>({
   tableName,
   data,
   columns,
   onRowClick,
   onViewClick,
   onEditClick,
   keyField = "id",
   selectKey,
   statusField,
   href,
   actions = true,
   eye = true,
   edit = true,
   trash = true,
   isLoading = false,
   setId = () => {},
   setSelectedRowData = () => {},
   maxTextLength = 20,
   deleteFunctions = () => {},
   tableStyle,
   theadStyle,
   trStyle,
   tbodyStyle,
   isSelect,
   currentPage = 1, // Add currentPage prop
   setCurrentPage,
   pageLimit = 10,
   dataLength = 10,
   setStatusFilter,
   BtnName,
   isBtn,
   BtnClick,
   tableWidth,
   numberOfPages,
   loadingLength = 4,
}: TableProps<T>) => {
   const skeletonStyle = {
      height: "20px",
      width: "100%",
      ...shimmerLight,
   };

   const smallSkeletonStyle = {
      height: "20px",
      width: "20px",
      ...shimmerLight,
   };

   const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);
   const [tableIds, setTableIds] = useState<string[]>([]);
   const [filterObject, setFilterObject] = useState({});
   const [filteredData, setFilteredData] = useState<T[]>([]);
   const router = useRouter();

   const pageRangeDisplayed = 5;
   const rowsPerPage = pageLimit || 2;

   const truncateText = (text: string, maxLength: number) => {
      if (!text) return "-";
      if (text?.length > maxLength) {
         return text?.substring(0, maxLength) + "...";
      }
      return text;
   };

   const totalPages = Math.ceil(numberOfPages || 0 / rowsPerPage) || Math.ceil(dataLength / rowsPerPage);

   const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
   };

   const currentData = filteredData;

   const handleViewClick = (id: string) => {
      if (href) {
         router.push(`${href}/${id}`);
      }
   };

   const getAllIds = () => {
      const IdsArr = filteredData.map((item) => (selectKey ? item[selectKey] : item?._id));

      setTableIds((prevIds) => {
         const allExist = IdsArr.every((id) => prevIds.includes(id));

         if (allExist) {
            return prevIds.filter((id) => !IdsArr.includes(id));
         } else {
            const newIds = [...new Set([...prevIds, ...IdsArr])];
            return newIds;
         }
      });
   };

   const getSingleIds = (id: string) => {
      setTableIds((prevIds) => {
         if (prevIds.includes(id)) {
            return prevIds.filter((itemId) => itemId !== id);
         } else {
            return [...prevIds, id];
         }
      });
   };

   const generatePageNumbers = () => {
      let startPage = Math.max(currentPage - Math.floor(pageRangeDisplayed / 2), 1);
      let endPage = startPage + pageRangeDisplayed - 1;

      if (endPage > totalPages) {
         endPage = totalPages;
         startPage = Math.max(endPage - pageRangeDisplayed + 1, 1);
      }

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
         pages.push(i);
      }

      return pages;
   };

   const getFilterObjects = columns.filter((item) => "select" in item || "search" in item);

   const HandleFilterChange = (key: string, value: string | number) => {
      setFilterObject((prev) => ({ ...prev, [key]: value }));
      setStatusFilter?.(key, value);
      setCurrentPage(1);
   };

   useEffect(() => {
      if (setStatusFilter !== undefined) {
         return setFilteredData(data);
      }

      const result = data?.filter((item) =>
         Object.entries(filterObject).every(([key, value]) => {
            const itemValue = item[key];

            if (typeof itemValue === "string") {
               return itemValue.toLowerCase().includes(String(value).toLowerCase());
            }

            if (typeof itemValue === "number") {
               return itemValue.toString().includes(String(value));
            }

            return false;
         }),
      );
      setFilteredData(result);
   }, [data, filterObject]);

   return (
      <div className={`overflow-x-auto  ${tableName ? "py-0" : "py-0"} pb-3 rounded-sm flex  flex-col  bg-transparent dark:bg-cardBG`} style={{ maxWidth: "100%" }}>
         <div className="flex px-5 justify-between py-3.5 border-b! border-[#B8975A]/10!">
            {tableName && <p className="tracking-[0.12em] text-headingColor font-medium uppercase">{tableName}</p>}
            <div className="flex gap-2 items-center">
               {Object.values(filterObject)?.length != 0 && <RefreshCcw onClick={() => setFilterObject({})} className="ml-10 cursor-pointer active:rotate-90 transition-all duration-300" />}

               <div className="h-full flex gap-2">
                  {getFilterObjects?.map(
                     (item) =>
                        "search" in item && (
                           <Field
                              type={item?.type}
                              key={item?.mapKey || item?.key}
                              name={item?.name}
                              onChange={(e: any) => (item?.onSearchChange ? item?.onSearchChange(item?.name, e.target.value) : HandleFilterChange(item?.key, e.target.value))}
                              placeHolder={`Search ${item?.header}`}
                              isIcon
                              icon={<Search className="dark:text-secondaryTextColor text-secondaryTextColor mr-2 w-5 h-5" />}
                              className="outline-none md:flex hidden h-full"
                              inputCustomClass="outline-none"
                           />
                        ),
                  )}
               </div>

               <div className="md:flex hidden gap-2">
                  {getFilterObjects?.map(
                     (item) =>
                        "select" in item && (
                           <DropdownMenu onOpenChange={(e) => setIsOpenDropDown(e)} key={item?.mapKey || item?.key}>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="lg" className="ml-auto  border border-textColorLight dark:border-textColorDark">
                                    {(filterObject as string)[item.key] === "" || (filterObject as string)[item.key] === undefined ? item.displayName : (filterObject as string)[item.key]}
                                    {isOpenDropdown ? <ChevronDown /> : <ChevronUp />}
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuItem key={item.key} onClick={() => HandleFilterChange(item?.key, "")}>
                                    {item?.displayName}
                                 </DropdownMenuItem>
                                 {item?.select?.map((subItem: string | number) => (
                                    <DropdownMenuItem key={subItem} onClick={() => HandleFilterChange(item?.key, subItem)}>
                                       {subItem}
                                    </DropdownMenuItem>
                                 ))}
                              </DropdownMenuContent>
                           </DropdownMenu>
                        ),
                  )}
               </div>
               <div className=" flex gap-2 items-center">{isBtn && <UIButton name={BtnName || "Add Name"} onClick={BtnClick} />}</div>
            </div>
         </div>

         <div className="max-h-[calc(100vh)] overflow-auto  ">
            <div className={"w-full overflow-y-auto overflow-x-auto max-h-[50vh]"}>
               <table
                  cellPadding="10"
                  className={tableWidth ? tableWidth : "md:w-full sm:w-200 w-200"}
                  style={{
                     ...tableStyle,
                     borderCollapse: "separate",
                     borderSpacing: "0 0rem",
                  }}
               >
                  <thead className=" dark:bg-cardBG sticky top-0 border-t! border-[#B8975A]/8! bg-staticSecondaryBG" style={{ ...theadStyle, zIndex: 10 }}>
                     <tr style={{ ...trStyle }} className="text-start text-[#5E5F60] text-xs border-t! border-gray-200!">
                        {!isLoading && isSelect && (
                           <div className={`pb-3 font-medium pt-4 max-h-50 h-15 flex items-center justify-center pl-[2.2rem] pr-8`} style={{ width: 20 }}>
                              <input type="checkbox" className="accent-primary" checked={currentData?.length === tableIds?.length && currentData?.length !== 0} onChange={() => getAllIds()} />
                           </div>
                        )}
                        {columns.map((column) => (
                           <th key={column?.mapKey || column?.key} className={`py-3 uppercase text-[10px] text-[#5E5F60]! text-start px-5 font-medium!  tracking-widest ${column.className || ""}`}>
                              {column.header}
                           </th>
                        ))}
                        {actions && <th className={`py-6 font-medium dark:text-textColorDark text-textColorLight`}>Action</th>}
                     </tr>
                  </thead>
                  <tbody className="bg-transparent dark:bg-cardBG" style={{ ...tbodyStyle }}>
                     {isLoading ? (
                        Array.from({ length: loadingLength }).map((_, index) => (
                           <tr key={index} className="hover:bg-gray-100 dark:hover:bg-layoutDarkBG cursor-pointer shadow" style={{ marginBottom: "0.5rem" }}>
                              {columns.map((_, i) => (
                                 <td key={i} className="py-4 text-sm font-normal text-center" style={{ padding: "0.75rem" }}>
                                    <div className="py-5">
                                       <div style={skeletonStyle}></div>
                                    </div>
                                 </td>
                              ))}
                              {actions && (
                                 <td className="py-5 text-sm font-normal text-center" style={{ padding: "0.75rem" }}>
                                    <div className="flex justify-center gap-4 py-5">
                                       <div style={smallSkeletonStyle}></div>
                                       <div style={smallSkeletonStyle}></div>
                                       <div style={smallSkeletonStyle}></div>
                                    </div>
                                 </td>
                              )}
                           </tr>
                        ))
                     ) : currentData?.length > 0 ? (
                        currentData.map((item, index) => (
                           <tr
                              key={keyField ? item[keyField] : index}
                              className={`border-b! border-[#B8975A]/8! h-auto ${onRowClick && "hover:bg-[#F5F0E8]! hover:cursor-pointer"}`}
                              style={{ ...trStyle }}
                              onClick={() => {
                                 if (onRowClick) {
                                    onRowClick(item);
                                    setId(item[keyField]);
                                 } else {
                                    setId(item[keyField]);
                                 }
                              }}
                           >
                              {isSelect && (
                                 <td key={keyField ? item[keyField] : index} className="py-4  font-normal text-[12px] text-textBlack text-start  border-t w-10 border-[#B8975A]/8! pl-[1.8rem] ">
                                    <input type="checkbox" className="accent-primary" checked={tableIds?.includes(selectKey ? item[selectKey] : item?._id)} onChange={() => getSingleIds(selectKey ? item[selectKey] : item?._id)} />
                                 </td>
                              )}

                              {columns.map((column, i) => {
                                 if (column.key === statusField && statusField) {
                                    const status = item[statusField];
                                    return (
                                       <td key={column?.mapKey || column?.key} className="py-4  text-[12px]! font-medium text-textBlack text-start px-5 border-t w-60  border-[#B8975A]/8! ">
                                          <span className={`inline-block  rounded-sm text-sm!`}>{truncateText(status, maxTextLength)}</span>
                                       </td>
                                    );
                                 }

                                 if (column.render) {
                                    return (
                                       <td key={column?.mapKey || column?.key} className={`py-4  font-medium text-[12px]! text-textBlack text-start px-5 w-60  border-t border-[#B8975A]/8!  ${column.className || ""}`}>
                                          {column.render(item[column.key], item)}
                                       </td>
                                    );
                                 }

                                 return (
                                    <td key={column?.mapKey || column?.key} className={`py-4 text-[12px]! font-medium  text-textBlack text-start px-5  border-t  border-[#B8975A]/8!  w-60 ${column.className || ""} ${isSelect === true ? i === 0 && "w-4" : i === 0 && "w-60"}`}>
                                       {truncateText(item[column.key], maxTextLength)}
                                    </td>
                                 );
                              })}
                              {actions && (
                                 <td className="py-4 text-sm! font-normal text-right border-t  border-headingLight w-60">
                                    <div className="flex gap-4 items-center justify-center">
                                       {eye && (
                                          <div
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                if (onViewClick) {
                                                   onViewClick(item);
                                                } else {
                                                   handleViewClick(item[keyField]);
                                                }
                                                setSelectedRowData(item);
                                             }}
                                             style={{ cursor: "pointer" }}
                                          >
                                             <Eye className="w-5 h-5 text-textBlack hover:text-textblack dark:text-textblack" />
                                          </div>
                                       )}
                                       {edit && (
                                          <div
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                if (onEditClick) {
                                                   onEditClick(item);
                                                }
                                                setSelectedRowData(item);
                                             }}
                                             style={{ cursor: "pointer" }}
                                          >
                                             <Edit className="w-5 h-5 text-textblack hover:text-textblack dark:text-textblack" />
                                          </div>
                                       )}
                                       {trash && (
                                          <div
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                setId(item[keyField]);
                                                deleteFunctions();
                                             }}
                                             style={{ cursor: "pointer" }}
                                          >
                                             <Trash className="w-5 h-5 text-textblack hover:text-textblack dark:text-textblack" />
                                          </div>
                                       )}
                                    </div>
                                 </td>
                              )}
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={columns.length + 2} className="py-4 px-2 text-sm! font-normal text-center text-gray-500 md:px-4" style={{ padding: "1.5rem 0.75rem" }}>
                              No Data Found
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            <div className="flex items-end justify-between max-sm:justify-center flex-row-reverse px-8 w-full ">
               <div className={`mt-4 flex gap-2 items-end justify-end-safe`}>
                  <div className={`flex gap-0 px-4  border border-headingLight/70 rounded-sm text-sm `}>
                     <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="py-2 pr-4  cursor-pointer text-textBlack">
                        Previous
                     </button>

                     {generatePageNumbers().map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`w-8 border cursor-pointer ${currentPage === page ? "bg-[#1a40ff] border-[#1a40ff] text-white " : "border-headingLight/70"}`}>
                           {page}
                        </button>
                     ))}

                     <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="py-2 pl-4 cursor-pointer text-textBlack">
                        Next
                     </button>
                  </div>
               </div>
               <div className="max-md:hidden text-textBlack!">
                  <span>Total Page : {totalPages}</span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default dynamic(() => Promise.resolve(Table), { ssr: false });
