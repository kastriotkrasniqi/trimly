import { useEffect, useId, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
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
    ListFilterIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { index as servicesApi } from "@/actions/App/Http/Controllers/API/ServicesController";
import { update as updateServicesApi } from "@/actions/App/Http/Controllers/ServiceController";
import { store as storeServicesApi } from "@/actions/App/Http/Controllers/ServiceController";
import { destroy as destroyServicesApi } from "@/actions/App/Http/Controllers/ServiceController";
import { usePage, useForm, router } from "@inertiajs/react";
import { toast } from "sonner";

type Item = {
    id: string;
    name: string;
    description?: string;
    price?: string;
    duration?: string;
    created_at?: string;
    updated_at?: string;
};

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
    const searchableRowContent = `${row.original.name ?? ""} ${row.original.description ?? ""}`.toLowerCase();
    const searchTerm = (filterValue ?? "").toLowerCase();
    return searchableRowContent.includes(searchTerm);
};

// Shared ServiceModal component
function ServiceModal({
    open,
    setOpen,
    data,
    setData,
    onSubmit,
    processing,
    errors,
    title
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any;
    setData: (field: string, value: any) => void;
    onSubmit: () => void;
    processing: boolean;
    errors: any;
    title: string;
}) {
    // Track if user has attempted to submit
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        if (open) {
            setHasSubmitted(false); // Reset submission state when modal opens
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setData(name, type === "number" ? (value === "" ? "" : Number(value)) : value);
    };

    const handleSave = () => {
        setHasSubmitted(true);
        onSubmit();
    };

    // Allow modal to close on Cancel even if there are validation errors
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setHasSubmitted(false);
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
                        <Label htmlFor="modal-name">Name</Label>
                        <Input
                            id="modal-name"
                            name="name"
                            value={data.name || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="Enter service name"
                        />
                        {hasSubmitted && errors.name && (
                            <div className="text-destructive text-xs mt-1">{errors.name}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-description">Description</Label>
                        <Input
                            id="modal-description"
                            name="description"
                            value={data.description || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="Enter description"
                        />
                        {hasSubmitted && errors.description && (
                            <div className="text-destructive text-xs mt-1">{errors.description}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-price">Price (€)</Label>
                        <Input
                            id="modal-price"
                            name="price"
                            type="number"
                            value={data.price || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                        {hasSubmitted && errors.price && (
                            <div className="text-destructive text-xs mt-1">{errors.price}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modal-duration">Duration (minutes)</Label>
                        <Input
                            id="modal-duration"
                            name="duration"
                            type="number"
                            value={data.duration || ""}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="0"
                            min="1"
                            step="1"
                        />
                        {hasSubmitted && errors.duration && (
                            <div className="text-destructive text-xs mt-1">{errors.duration}</div>
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

// Add Service Button component
function AddServiceButton() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        price: "",
        duration: "",
    });

    const handleSubmit = () => {
        post(storeServicesApi.url(), {
            onSuccess: () => {
                setOpen(false);
                reset();
                toast.success("Service created successfully");
            },
        });
    };

    return (
        <>
            <Button className="ml-auto" variant="outline" onClick={() => setOpen(true)}>
                <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                Add Service
            </Button>

            <ServiceModal
                open={open}
                setOpen={setOpen}
                data={data}
                setData={setData}
                onSubmit={handleSubmit}
                processing={processing}
                errors={errors}
                title="Add Service"
            />
        </>
    );
}

// Row Actions component
function RowActions({ row }: { row: Row<Item> }) {
    const [editOpen, setEditOpen] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        name: row.original.name ?? "",
        description: row.original.description ?? "",
        price: row.original.price ?? "",
        duration: row.original.duration ?? "",
    });

    // Reset form data to latest row values when opening modal
    const handleEditOpen = () => {
        setData({
            name: row.original.name ?? "",
            description: row.original.description ?? "",
            price: row.original.price ?? "",
            duration: row.original.duration ?? "",
        });
        setEditOpen(true);
    };

    const handleSubmit = () => {
        put(updateServicesApi.url(row.original.id), {
            onSuccess: () => {
                reset();
                toast.success("Service updated successfully");
                setEditOpen(false);
            },
            onError: () => {
                // Modal stays open if validation fails
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
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <TrashIcon size={16} className="mr-2" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ServiceModal
                open={editOpen}
                setOpen={setEditOpen}
                data={data}
                setData={setData}
                onSubmit={handleSubmit}
                processing={processing}
                errors={errors}
                title="Edit Service"
            />
        </>
    );
}

// Table columns definition
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
        header: "Name",
        accessorKey: "name",
        filterFn: multiColumnFilterFn,
        size: 180,
        enableHiding: false,
        sortingFn: (rowA, rowB) => {
            const a = (rowA.original.name ?? "").toLowerCase();
            const b = (rowB.original.name ?? "").toLowerCase();
            return a.localeCompare(b);
        },
    },
    {
        header: "Description",
        accessorKey: "description",
        size: 220,
        enableHiding: false,
    },
    {
        header: "Price",
        accessorKey: "price",
        cell: ({ row }) => {
            const price = row.original.price;
            if (!price) return "";
            return `${price} €`;
        },
        size: 80,
        enableHiding: false,
    },
    {
        header: "Duration",
        accessorKey: "duration",
        cell: ({ row }) => {
            const duration = row.original.duration;
            if (!duration) return "";
            return `${duration} min`;
        },
        size: 80,
        enableHiding: false,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} />,
        size: 60,
        enableHiding: false,
    },
];

// Main Services Datatable component
export function ServicesDatatable() {
    const id = useId();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props as any;

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "name",
            desc: false,
        },
    ]);

    const [data, setData] = useState<Item[]>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");

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
    }, [debouncedGlobalFilter]);

    // Fetch data from API
    useEffect(() => {
        async function fetchServices() {
            const page = pagination.pageIndex + 1;
            const perPage = pagination.pageSize;
            const search = debouncedGlobalFilter ? `&search=${encodeURIComponent(debouncedGlobalFilter)}` : "";
            const res = await fetch(`${servicesApi.url(auth.user)}?page=${page}&per_page=${perPage}${search}`);
            const services = await res.json();
            setData(services.data ?? []);
            setTotalRows(services.meta?.total ?? 0);
        }
        fetchServices();
    }, [pagination.pageIndex, pagination.pageSize, debouncedGlobalFilter, auth.user]);

    // Delete selected services by sending their IDs to the backend

    const handleDeleteRows = () => {
        const selectedRows = table.getSelectedRowModel().rows;

        const ids = selectedRows.map((row) => row.original.id);
        if (ids.length === 0) return;
        router.post(destroyServicesApi.url(), { ids }, {
            preserveScroll: true,
            onSuccess: () => {
                const updatedData = data.filter((item) => !ids.includes(item.id));
                setData(updatedData);
                table.resetRowSelection();
                toast.success('Selected services deleted');
            },
            onError: () => {
                toast.error('Failed to delete selected services');
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
    });

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
                            placeholder="Search services..."
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
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-3">
                    {/* Delete button */}
                    {table.getSelectedRowModel().rows.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="ml-auto" variant="outline">
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
                                                ? "service"
                                                : "services"}
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

                    <AddServiceButton />
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
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault();
                                                            header.column.getToggleSortingHandler()?.(e);
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
                                    );
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
                                    No services found.
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
                            table.setPageSize(Number(value));
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
    );
}
