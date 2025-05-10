"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../../ui/badge";
import PageHeader from "../main/PageHeader";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import { History } from "@/types/History";
import ConfirmDelete from "../general/ConfirmDelete";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";

export default function EventList({
  institutionId,
}: {
  institutionId: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [events, setEvents] = React.useState<History[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const institutionRef = doc(db, "institutions", institutionId);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!institutionId) return;
      setLoading(true);
      const eventsRef = collection(db, "historyEvents");
      const q = query(
        eventsRef,
        where("institutionOwning", "==", institutionRef)
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const eventsData: History[] = [];

          for (const doc of snapshot.docs) {
            const docData = doc.data();
            const userRef =
              docData?.createdBy as DocumentReference<DocumentData>;
            const institutionRef =
              docData?.institutionOwning as DocumentReference<DocumentData>;

            let userData: CustomUser | null = null;
            let institutionData: { id: string; name: string } | null = null;

            try {
              if (userRef) {
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                  const userSnapshotData = userSnapshot.data();
                  userData = {
                    id: userSnapshot.id,
                    uid: userSnapshot.id,
                    displayName: userSnapshotData?.displayName,
                    email: userSnapshotData?.email ?? "",
                  };
                }
              }

              if (institutionRef) {
                const institutionSnapshot = await getDoc(institutionRef);
                if (institutionSnapshot.exists()) {
                  const institutionSnapshotData = institutionSnapshot.data();
                  institutionData = {
                    id: institutionSnapshot.id,
                    name: institutionSnapshotData?.name,
                  };
                }
              }
            } catch (error) {
              console.error("Error fetching referenced document:", error);
              continue;
            }

            eventsData.push({
              id: doc.id,
              ...docData,
              createdBy: userData,
              institutionOwning: institutionData?.name,
            } as History);
          }
          setEvents(eventsData);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching events:", err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };
    fetchData();
  }, [institutionId]);

  const columns: ColumnDef<History>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown />
          </Button>
        );
      },
    },
    {
      accessorKey: "occuringDate",
      header: "Occuring Date",
      cell: ({ row }) => (
        <Badge className="capitalize">{row.getValue("occuringDate")}</Badge>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <div className="capitalize">
          {row?.original?.createdBy?.displayName ?? "Unknown"}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Learn More</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Edit the Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Preview Event</DropdownMenuItem>
              <DropdownMenuItem
                color="danger"
                onClick={() => {
                  setIdToDelete(item?.id);
                  setOpenDelete(true);
                }}
              >
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: events,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) return <Loading />;

  const handleDeleteItem = () => {
    if (typeof idToDelete === "string" && idToDelete.trim() !== "") {
      deleteDoc(doc(db, "historyEvents", idToDelete))
        .then(() => {
          setIdToDelete("");
          setOpenDelete(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="w-full space-y-4 p-8 pt-6">
      <ConfirmDelete
        action={() => handleDeleteItem()}
        cancel={() => {
          setIdToDelete("");
          setOpenDelete(false);
        }}
        open={openDelete}
      ></ConfirmDelete>
      <PageHeader
        title="History Events"
        newItem={false}
        onExport={() => null}
        onPublish={() => null}
        saveDraft={() => null}
      />

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter events..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
