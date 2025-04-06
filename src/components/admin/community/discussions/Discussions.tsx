"use client";

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
import { db } from "@/db/firebase";
import { Discussion } from "@/types/Discussion";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmAction } from "../../general/ConfirmDelete";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

function Discussions({ institutionId }: { institutionId: string }) {
  const { user } = useAuth();
  const workflowCollection = collection(db, "workflow_actions");

  const [discussions, setDiscussions] = useState<(Discussion | null)[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [openHide, setOpenHide] = React.useState(false);
  const [idToHide, setIdToHide] = React.useState("");
  const [openUnhide, setOpenUnhide] = React.useState(false);
  const [idToUnhide, setIdToUnhide] = React.useState("");
  const [openApprove, setOpenApprove] = React.useState(false);
  const [idToApprove, setIdToApprove] = React.useState("");
  const [openUnapprove, setOpenUnapprove] = React.useState(false);
  const [idToUnapprove, setIdToUnapprove] = React.useState("");
  const [openReject, setOpenReject] = React.useState(false);
  const [idToReject, setIdToReject] = React.useState("");
  const userRef = doc(db, "profile", String(user?.uid));
  const institutionRef = doc(db, "institutions", institutionId);

  React.useEffect(() => {
    const getData = async () => {
      const itemCollection = collection(db, "discussions");

      const q = query(itemCollection);
      onSnapshot(q, async (snapshot) => {
        const discussionsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const docData = doc.data();
            const userRef =
              docData?.createdBy as DocumentReference<DocumentData>;
            const topicRef = docData?.topic as DocumentReference<DocumentData>;

            let userData: DocumentData | null = null;
            let topicData: DocumentData | null = null;

            try {
              if (userRef) {
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                  userData = {
                    id: userSnapshot?.id,
                    name: userSnapshot.data(),
                  };
                }
              }

              if (topicRef) {
                const topicSnapshot = await getDoc(topicRef);
                if (topicSnapshot.exists()) {
                  topicData = {
                    id: topicSnapshot?.id,
                    name: topicSnapshot.data().name,
                  };
                }
              }
            } catch (error) {
              console.error("Error fetching referenced document:", error);
              return null;
            }

            return {
              id: doc.id,
              topic: topicData ? topicData : null,
              createdAt: formatDistance(
                docData.createdAt.toDate(),
                new Date(),
                {
                  includeSeconds: true,
                }
              ),
              createdBy: userData ? userData : null,
              title: doc.data()?.title,
              description: doc.data().description,
              upvotes: doc.data().upvotes,
              replyCount: doc.data().replyCount,
              views: doc.data().views,
            } as Discussion;
          })
        );
        setDiscussions(discussionsData);
        console.log(discussionsData);
      });
    };
    getData();
  }, []);

  const columns: ColumnDef<(typeof discussions)[0]>[] = [
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row?.original?.title}</div>,
      enableColumnFilter: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "createdBy",
      header: "Discussion Creator",
      cell: ({ row }) => <div>{row.original?.createdBy?.displayName}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item: Discussion | null = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {item?.status === "approved" ? (
                <DropdownMenuItem
                  onClick={() => {
                    setIdToUnapprove(item?.id);
                    setOpenUnapprove(true);
                  }}
                >
                  Unapprove
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setIdToApprove(item?.id || "");
                    setOpenApprove(true);
                  }}
                >
                  Approve
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setIdToReject(item?.id || "");
                  setOpenReject(true);
                }}
              >
                Reject
              </DropdownMenuItem>
              {item?.status !== "hidden" ? (
                <DropdownMenuItem
                  onClick={() => {
                    setIdToHide(item?.id || "");
                    setOpenHide(true);
                  }}
                >
                  Hide
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setIdToUnhide(item?.id || "");
                    setOpenUnhide(true);
                  }}
                >
                  Unhide
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Preview Discussion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: discussions,
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

  const handleApprove = async () => {
    const discussionRef = doc(db, "discussions", idToApprove);
    await updateDoc(discussionRef, {
      status: "approved",
    });
    await addDoc(workflowCollection, {
      activity: "APPROVE",
      user: userRef,
      approvalInstitution: institutionRef,
      discussion: discussionRef,
      createdAt: new Date(),
    });
    await toast("Item approved successfully!");
    setOpenApprove(false);
  };

  const handleReject = async () => {
    const discussionRef = doc(db, "discussions", idToReject);
    await updateDoc(discussionRef, {
      status: "rejected",
    });
    await addDoc(workflowCollection, {
      activity: "REJECT",
      user: userRef,
      approvalInstitution: institutionRef,
      discussion: discussionRef,
      createdAt: new Date(),
    });
    toast("Item rejected successfully!");
    setOpenReject(false);
  };

  const handleHide = async () => {
    const discussionRef = doc(db, "discussions", idToHide);
    await updateDoc(discussionRef, {
      status: "hidden",
    });
    await addDoc(workflowCollection, {
      activity: "HIDE",
      user: userRef,
      approvalInstitution: institutionRef,
      discussion: discussionRef,
      createdAt: new Date(),
    });
    toast("Item hidden successfully!");
    setOpenHide(false);
  };

  const handleUnHide = async () => {
    const discussionRef = doc(db, "discussions", idToUnhide);
    await updateDoc(discussionRef, {
      status: "pending_approval",
    });
    await addDoc(workflowCollection, {
      activity: "UNHIDE",
      user: userRef,
      approvalInstitution: institutionRef,
      discussion: discussionRef,
      createdAt: new Date(),
    });
    toast("Item unhidden successfully!");
    setOpenUnhide(false);
  };

  const handleUnApprove = async () => {
    const discussionRef = doc(db, "discussions", idToUnapprove);
    await updateDoc(discussionRef, {
      status: "pending_approval",
    });
    await addDoc(workflowCollection, {
      activity: "UNAPPROVE",
      user: userRef,
      approvalInstitution: institutionRef,
      discussion: discussionRef,
      createdAt: new Date(),
    });
    toast("Item unapproved successfully!");
    setOpenUnapprove(false);
  };

  return (
    <div className="pl-4">
      <ConfirmAction
        action={() => handleApprove()}
        cancel={() => {
          setIdToApprove("");
          setOpenApprove(false);
        }}
        open={openApprove}
        activity="APPROVE"
      ></ConfirmAction>

      <ConfirmAction
        action={() => handleReject()}
        cancel={() => {
          setIdToReject("");
          setOpenReject(false);
        }}
        open={openReject}
        activity="REJECT"
      ></ConfirmAction>

      <ConfirmAction
        action={() => handleHide()}
        cancel={() => {
          setIdToHide("");
          setOpenHide(false);
        }}
        open={openHide}
        activity="HIDE"
      ></ConfirmAction>

      <ConfirmAction
        action={() => handleUnHide()}
        cancel={() => {
          setIdToUnhide("");
          setOpenUnhide(false);
        }}
        open={openUnhide}
        activity="UNHIDE"
      ></ConfirmAction>

      <ConfirmAction
        action={() => handleUnApprove()}
        cancel={() => {
          setIdToUnapprove("");
          setOpenUnapprove(false);
        }}
        open={openUnapprove}
        activity="UNAPPROVE"
      ></ConfirmAction>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter discussions..."
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

export default Discussions;
