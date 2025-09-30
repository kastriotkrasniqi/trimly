import { useEffect, useId, useMemo, useRef, useState } from "react"
import debounce from "lodash.debounce"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { index as clientsApi } from "@/actions/App/Http/Controllers/API/ClientController"
import { update as updateClientsApi } from "@/actions/App/Http/Controllers/ClientController"
import { store as storeClientsApi } from "@/actions/App/Http/Controllers/ClientController"
import { destroy as destroyClientsApi } from "@/actions/App/Http/Controllers/ClientController"
import { usePage, useForm, router } from "@inertiajs/react"
import { User } from "@/types"
import { Service } from "@/types/booking"

type Item = {
  id: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  phone?: string;
  avatar?: string;
  specialties?: string[];
  is_active?: boolean;
  services?: Service[];
};

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
  const searchableRowContent =
  `${row.original.user?.name ?? ""} ${row.original.phone ?? ""}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

// Shared EmployeeModal component
function EmployeeModal({
    open,
    setOpen,
    data,
    setData,
    onSubmit,
    processing,
    errors,
    title,
    currentAvatar
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any;
    setData: (field: string, value: any) => void;
    onSubmit: () => void;
    processing: boolean;
    errors: any;
    title: string;
    currentAvatar?: string;
}) {
    // Track if user has attempted to submit
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setHasSubmitted(false); // Reset submission state when modal opens
            setAvatarPreview(null); // Reset avatar preview
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setData(name, type === "number" ? (value === "" ? "" : Number(value)) : value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('avatar', null);
            setAvatarPreview(null);
        }
    };

    const handleSave = () => {
        setHasSubmitted(true);
        onSubmit();
    };

    // Allow modal to close on Cancel even if there are validation errors
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setHasSubmitted(false);
            setAvatarPreview(null);
        }
        setOpen(newOpen);
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Fill in the fields below.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div>
                        <Label htmlFor="modal-avatar">Avatar</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : currentAvatar ? (
                                    <img
                                        src={currentAvatar}
                                        alt="Current avatar"
                                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="modal-avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={processing}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload an image file (JPG, PNG, etc.) - Max size: 2MB
                                </p>
                            </div>
                        </div>
                        {hasSubmitted && errors.avatar && (
                            <div className="text-destructive text-xs mt-1">{errors.avatar}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-name">Name</Label>
                        <Input
                            id="modal-name"
                            name="name"
                            value={data.name || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="Enter employee name"
                        />
                        {hasSubmitted && errors.name && (
                            <div className="text-destructive text-xs mt-1">{errors.name}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-email">Email</Label>
                        <Input
                            id="modal-email"
                            name="email"
                            type="email"
                            value={data.email || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="Enter email address"
                        />
                        {hasSubmitted && errors.email && (
                            <div className="text-destructive text-xs mt-1">{errors.email}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-phone">Phone</Label>
                        <Input
                            id="modal-phone"
                            name="phone"
                            value={data.phone || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="Enter phone number"
                        />
                        {hasSubmitted && errors.phone && (
                            <div className="text-destructive text-xs mt-1">{errors.phone}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-password">Password</Label>
                        <Input
                            id="modal-password"
                            name="password"
                            type="password"
                            value={data.password || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder={title.includes("Edit") ? "Leave blank to keep current password" : "Enter password"}
                        />
                        {hasSubmitted && errors.password && (
                            <div className="text-destructive text-xs mt-1">{errors.password}</div>
                        )}
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button onClick={handleSave} disabled={processing}>
                        {processing ? "Saving..." : "Save"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Add Employee Button component
function AddEmployeeButton({ onRefresh }: { onRefresh: () => void }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        avatar: null as File | null,
    });

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone || '');
        formData.append('password', data.password);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        router.post('/clients', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                onRefresh(); // Trigger data refresh
            },
        });
    };    return (
        <>
            <Button className="ml-auto" variant="outline" onClick={() => setOpen(true)}>
                <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                Add Client
            </Button>

            <EmployeeModal
                open={open}
                setOpen={setOpen}
                data={data}
                setData={setData}
                onSubmit={handleSubmit}
                processing={processing}
                errors={errors}
                title="Add Client"
                currentAvatar={undefined}
            />
        </>
    );
}



const columns: ColumnDef<Item>[] = [
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
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "user.name",
    header: "Name",
    accessorKey: "user.name",
    cell: ({ row }) => <div className="font-medium">{row.original.user?.name ?? ""}</div>,
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
    sortingFn: (rowA, rowB) => {
      const a = `${rowA.original.user?.name ?? ""}`.toLowerCase();
      const b = `${rowB.original.user?.name ?? ""}`.toLowerCase();
      return a.localeCompare(b);
    },
  },
  {
    header: "Phone",
    accessorKey: "phone",
    cell: ({ row }) => row.original.phone ?? "",
    sortingFn: (rowA, rowB) => {
      const a = `${rowA.original.phone ?? ""}`.toLowerCase();
      const b = `${rowB.original.phone ?? ""}`.toLowerCase();
      return a.localeCompare(b);
    },
    size: 140,
  },
  {
    header: "Image",
    accessorKey: "avatar",
    cell: ({ row }) => row.original.avatar ? <img src={row.original.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" /> : (
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs">No</span>
      </div>
    ),
    size: 60,
  },
  {
    header: "Email",
    accessorKey: "user.email",
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.original.user?.email ?? ""}</div>,
    size: 200,
    sortingFn: (rowA, rowB) => {
      const a = `${rowA.original.user?.email ?? ""}`.toLowerCase();
      const b = `${rowB.original.user?.email ?? ""}`.toLowerCase();
      return a.localeCompare(b);
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      return <RowActions row={row} table={table} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />;
    },
    size: 60,
    enableHiding: false,
  },
];



export function Datatable() {
  const id = useId()
  const { auth } = usePage().props as any;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null)

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "user.name",
      desc: false,
    },
  ])

  const [data, setData] = useState<Item[]>([]);
  // Global filter state for server-side search
  const [globalFilter, setGlobalFilter] = useState("");
  // Debounced global filter for server fetch
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");
  // Refresh trigger for data refetch
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Debounce globalFilter using lodash.debounce
  useEffect(() => {
    const debounced = debounce((value: string) => {
      setDebouncedGlobalFilter(value);
    }, 400);
    debounced(globalFilter);
    return () => {
      debounced.cancel();
    };
  }, [globalFilter]);

  // Reset to first page when globalFilter changes
  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex !== 0 ? { ...prev, pageIndex: 0 } : prev
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGlobalFilter]);

  useEffect(() => {
    async function fetchClients() {
      const page = pagination.pageIndex + 1;
      const perPage = pagination.pageSize;
      const search = debouncedGlobalFilter ? `&search=${encodeURIComponent(debouncedGlobalFilter)}` : "";
      const res = await fetch(`${clientsApi.url()}?page=${page}&per_page=${perPage}${search}`);
      const clients = await res.json();
      setData(clients.data ?? []);
      setTotalRows(clients.meta?.total ?? 0);
    }
    fetchClients();
  }, [pagination.pageIndex, pagination.pageSize, debouncedGlobalFilter, auth.user, refreshTrigger]);

  // Delete selected clients by sending their IDs to the backend
  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const ids = selectedRows.map((row) => row.original.id);
    if (ids.length === 0) return;
    router.post(destroyClientsApi.url(), { ids }, {
      preserveScroll: true,
      onSuccess: () => {
        table.resetRowSelection();
        setRefreshTrigger(prev => prev + 1); // Trigger data refresh
      },
    });
  };

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualFiltering: true,
    rowCount: totalRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })



  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Global search filter */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getState().globalFilter) && "pe-9"
              )}
              value={table.getState().globalFilter ?? ""}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder="Search by name or phone..."
              type="text"
              aria-label="Global search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getState().globalFilter) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.setGlobalFilter("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
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
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline" data-delete-trigger>
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "client"
                        : "clients"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <AddEmployeeButton onRefresh={() => setRefreshTrigger(prev => prev + 1)} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={String(row.id)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
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

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

function RowActions({ row, table, onRefresh }: { row: Row<Item>; table: any; onRefresh: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const { data, setData, put, post, processing, errors, reset } = useForm({
    name: row.original.user?.name ?? "",
    email: row.original.user?.email ?? "",
    phone: row.original.phone ?? "",
    password: "",
    avatar: null as File | null,
  });

  // Reset form data to latest row values when opening modal
  const handleEditOpen = () => {
    setData({
      name: row.original.user?.name ?? "",
      email: row.original.user?.email ?? "",
      phone: row.original.phone ?? "",
      password: "",
      avatar: null,
    });
    setEditOpen(true);
  };

  const handleSubmit = () => {
    if (data.avatar) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      if (data.password) {
          formData.append('password', data.password);
      }
      formData.append('avatar', data.avatar);
      formData.append('_method', 'PUT');

      router.post(`/clients/${row.original.id}`, formData, {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setEditOpen(false);
          onRefresh(); // Trigger data refresh
        },
        onError: () => {
          // Modal stays open if validation fails
        },
      });
    } else {
      // Use regular PUT for non-file updates
      put(updateClientsApi.url(row.original.id), {
        onSuccess: () => {
          reset();
          setEditOpen(false);
          onRefresh(); // Trigger data refresh
        },
        onError: () => {
          // Modal stays open if validation fails
        },
      });
    }
  };

  const handleDeleteSingle = () => {
    const ids = [row.original.id];
    router.post(destroyClientsApi.url(), { ids }, {
      preserveScroll: true,
      onSuccess: () => {
        onRefresh(); // Trigger data refresh
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Actions"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEditOpen}>
              <PencilIcon size={16} className="mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDeleteSingle}
          >
            <TrashIcon size={16} className="mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmployeeModal
        open={editOpen}
        setOpen={setEditOpen}
        data={data}
        setData={setData}
        onSubmit={handleSubmit}
        processing={processing}
        errors={errors}
        title="Edit Employee"
        currentAvatar={row.original.avatar}
      />
    </>
  );
}
