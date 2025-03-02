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
import { Article } from "@/types/Article";
import { Badge } from "../../ui/badge";
import PageHeader from "../main/PageHeader";

const data: Article[] = [
  {
    id: "ydyhdhhd",
    title: "The quick brown fox jumps over the lazy dog",
    status: "published",
    availability: "public",
    author: "Achille",
    body: "The quick brown fox jumps over the lazy dog",
  },
  {
    id: "ydyhdhhd",
    title: "How to build a website in 2021",
    status: "published",
    availability: "public",
    author: "Achille",
    body: "The quick brown fox jumps over the lazy dog",
  },
  {
    id: "abc123",
    title: "Introduction to TypeScript",
    status: "draft",
    availability: "private",
    author: "Jane Doe",
    body: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
  },
  {
    id: "def456",
    title: "Advanced React Patterns",
    status: "published",
    availability: "public",
    author: "John Smith",
    body: "Learn advanced patterns in React to build scalable applications.",
  },
  {
    id: "ghi789",
    title: "Getting Started with Tailwind CSS",
    status: "published",
    availability: "public",
    author: "Emily Johnson",
    body: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
  },
  {
    id: "jkl012",
    title: "Understanding Node.js Event Loop",
    status: "published",
    availability: "public",
    author: "Michael Brown",
    body: "The event loop is what allows Node.js to perform non-blocking I/O operations.",
  },
  {
    id: "mno345",
    title: "Best Practices for API Design",
    status: "draft",
    availability: "private",
    author: "Sarah Lee",
    body: "Designing APIs requires careful consideration of usability and scalability.",
  },
  {
    id: "pqr678",
    title: "Mastering CSS Grid",
    status: "published",
    availability: "public",
    author: "David Wilson",
    body: "CSS Grid is a powerful layout system for creating responsive web designs.",
  },
  {
    id: "stu901",
    title: "Effective Code Reviews",
    status: "published",
    availability: "public",
    author: "Laura Martinez",
    body: "Code reviews are essential for maintaining code quality and sharing knowledge.",
  },
  {
    id: "vwx234",
    title: "Introduction to Docker",
    status: "draft",
    availability: "private",
    author: "James Anderson",
    body: "Docker is a platform for developing, shipping, and running applications in containers.",
  },
  {
    id: "yzab567",
    title: "Exploring GraphQL",
    status: "published",
    availability: "public",
    author: "Emma White",
    body: "GraphQL is a query language for APIs and a runtime for executing those queries.",
  },
  {
    id: "cdef890",
    title: "Building RESTful APIs",
    status: "published",
    availability: "public",
    author: "Daniel Green",
    body: "RESTful APIs are a standard way to design web services.",
  },
  {
    id: "ghij123",
    title: "Introduction to Python",
    status: "draft",
    availability: "private",
    author: "Olivia Black",
    body: "Python is a versatile and beginner-friendly programming language.",
  },
  {
    id: "klmn456",
    title: "Deep Dive into JavaScript Closures",
    status: "published",
    availability: "public",
    author: "William Brown",
    body: "Closures are a fundamental concept in JavaScript.",
  },
  {
    id: "opqr789",
    title: "Understanding Redux",
    status: "published",
    availability: "public",
    author: "Sophia Davis",
    body: "Redux is a predictable state container for JavaScript apps.",
  },
  {
    id: "stuv012",
    title: "Getting Started with Vue.js",
    status: "draft",
    availability: "private",
    author: "Ethan Wilson",
    body: "Vue.js is a progressive JavaScript framework.",
  },
  {
    id: "wxyz345",
    title: "Introduction to Machine Learning",
    status: "published",
    availability: "public",
    author: "Ava Martinez",
    body: "Machine learning is a subset of artificial intelligence.",
  },
  {
    id: "abcd678",
    title: "Exploring WebAssembly",
    status: "published",
    availability: "public",
    author: "Noah Taylor",
    body: "WebAssembly allows running high-performance code in the browser.",
  },
  {
    id: "efgh901",
    title: "Introduction to Blockchain",
    status: "draft",
    availability: "private",
    author: "Isabella Moore",
    body: "Blockchain is a decentralized digital ledger technology.",
  },
  {
    id: "ijkl234",
    title: "Mastering Async/Await in JavaScript",
    status: "published",
    availability: "public",
    author: "Liam Anderson",
    body: "Async/await simplifies asynchronous programming in JavaScript.",
  },
  {
    id: "mnop567",
    title: "Introduction to Kubernetes",
    status: "published",
    availability: "public",
    author: "Mia Thomas",
    body: "Kubernetes is an open-source container orchestration platform.",
  },
  {
    id: "qrst890",
    title: "Understanding Microservices Architecture",
    status: "draft",
    availability: "private",
    author: "Lucas Jackson",
    body: "Microservices architecture breaks applications into smaller, independent services.",
  },
  {
    id: "uvwx123",
    title: "Getting Started with Firebase",
    status: "published",
    availability: "public",
    author: "Amelia White",
    body: "Firebase is a Backend-as-a-Service platform by Google.",
  },
  {
    id: "yzab456",
    title: "Introduction to Svelte",
    status: "published",
    availability: "public",
    author: "Benjamin Harris",
    body: "Svelte is a modern JavaScript framework for building user interfaces.",
  },
  {
    id: "cdef789",
    title: "Exploring Deno",
    status: "draft",
    availability: "private",
    author: "Charlotte Clark",
    body: "Deno is a secure runtime for JavaScript and TypeScript.",
  },
  {
    id: "ghij012",
    title: "Introduction to Rust",
    status: "published",
    availability: "public",
    author: "Henry Lewis",
    body: "Rust is a systems programming language focused on safety and performance.",
  },
  {
    id: "klmn345",
    title: "Understanding WebSockets",
    status: "published",
    availability: "public",
    author: "Ella Walker",
    body: "WebSockets enable real-time communication between clients and servers.",
  },
  {
    id: "opqr678",
    title: "Introduction to Graph Databases",
    status: "draft",
    availability: "private",
    author: "Alexander Hall",
    body: "Graph databases are designed to handle highly connected data.",
  },
  {
    id: "stuv901",
    title: "Getting Started with Flutter",
    status: "published",
    availability: "public",
    author: "Scarlett Young",
    body: "Flutter is a UI toolkit for building natively compiled applications.",
  },
  {
    id: "wxyz234",
    title: "Exploring Serverless Architecture",
    status: "published",
    availability: "public",
    author: "James Allen",
    body: "Serverless architecture allows developers to build applications without managing servers.",
  },
  {
    id: "abcd567",
    title: "Introduction to TensorFlow",
    status: "draft",
    availability: "private",
    author: "Grace Scott",
    body: "TensorFlow is an open-source machine learning framework.",
  },
  {
    id: "efgh890",
    title: "Understanding Progressive Web Apps",
    status: "published",
    availability: "public",
    author: "Daniel King",
    body: "Progressive Web Apps provide a native app-like experience on the web.",
  },
  {
    id: "ijkl123",
    title: "Introduction to Next.js",
    status: "published",
    availability: "public",
    author: "Chloe Wright",
    body: "Next.js is a React framework for building server-rendered applications.",
  },
  {
    id: "mnop456",
    title: "Exploring Three.js",
    status: "draft",
    availability: "private",
    author: "Ryan Lopez",
    body: "Three.js is a JavaScript library for 3D graphics on the web.",
  },
  {
    id: "qrst789",
    title: "Introduction to Web Components",
    status: "published",
    availability: "public",
    author: "Zoe Hill",
    body: "Web Components allow creating reusable custom elements in web applications.",
  },
  {
    id: "uvwx012",
    title: "Understanding Functional Programming",
    status: "published",
    availability: "public",
    author: "Nathan Green",
    body: "Functional programming is a paradigm that treats computation as the evaluation of mathematical functions.",
  },
  {
    id: "yzab345",
    title: "Introduction to Dart",
    status: "draft",
    availability: "private",
    author: "Hannah Adams",
    body: "Dart is a programming language optimized for building mobile, desktop, and web applications.",
  },
  {
    id: "cdef678",
    title: "Exploring WebGL",
    status: "published",
    availability: "public",
    author: "Eli Baker",
    body: "WebGL is a JavaScript API for rendering interactive 3D and 2D graphics.",
  },
  {
    id: "ghij901",
    title: "Introduction to Go",
    status: "published",
    availability: "public",
    author: "Lily Carter",
    body: "Go is a statically typed, compiled programming language designed for simplicity and efficiency.",
  },
];

export const columns: ColumnDef<Article>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="capitalize">{row.getValue("status")}</Badge>
    ),
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("availability")}</div>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("author")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Edit the post
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Preview post</DropdownMenuItem>
            <DropdownMenuItem color="danger">Delete Post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BlogList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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

  return (
    <div className="w-full space-y-4 p-8 pt-6">
      <PageHeader
        title="Posts"
        newItem={false}
        onExport={() => null}
        onPublish={() => null}
        saveDraft={() => null}
      />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter posts..."
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
