'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext, useMemo, useReducer } from "react";
import { FormProvider, useForm, UseFormReturn, useWatch } from "react-hook-form";
import z from "zod";


// ----------------------
// ✅ Zod Schemas
// ----------------------
const purchaseOrderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Unit price must be positive"),
  dto: z.number().min(0, "Discount must be positive"),
  iva: z.number().min(0, "Tax must be positive"),
  imageUrl: z.string(),
  name: z.string()
});

const purchaseOrderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
});

export type PurchaseOrderFormData = z.input<typeof purchaseOrderSchema>;
export type PurchaseOrderOutputFormData = z.output<typeof purchaseOrderSchema>;

// ----------------------
// Step Management Types
// ----------------------
export type ActiveStep = 'CHOOSE-PRODUCTS' | 'COMPLETE-PO';

interface ContextState {

}

type Action = { type: '' }


// ----------------------
//  Context Definition
// ----------------------
const PurchaseOrderContext = createContext<{
  state: ContextState;
  form: UseFormReturn<PurchaseOrderFormData>;
  totalQuantity: number;
  addItem(newItem: PurchaseOrderFormData["items"][number]): void;
  changeActiveStep(step: ActiveStep): void;
  updateQuantity(productId: string, quantity: number): void;
  removeItem(productId: string): void;
} | null>(null);

const initialState: ContextState = { activeStep: 'CHOOSE-PRODUCTS' };


function purchaseOrderReducer(state: ContextState, action: Action): ContextState {
  switch (action.type) {

    default:
      return state;
  }
}

export const PurchaseOrderProvider = ({ _initialState, initialFormValues, children }: { _initialState?: ContextState, initialFormValues?: PurchaseOrderFormData; children: ReactNode }) => {
  const [state, dispatch] = useReducer(purchaseOrderReducer, _initialState || initialState);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const changeActiveStep = (step: ActiveStep) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', step);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl)
  }

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: initialFormValues ?? {
      id: "",
      customerId: "",
      items: [],
    },
    mode: "onBlur",
  });

  const addItem = (newItem: PurchaseOrderFormData["items"][number]) => {
    const items = form.getValues("items");
    const existingIndex = items.findIndex((item) => item.productId === newItem.productId);

    if (existingIndex !== -1) {
      // If item exists, increase quantity

      const existingItem = items[existingIndex];
      const updatedQuantity = existingItem.quantity + newItem.quantity;
      updateQuantity(existingItem.productId, updatedQuantity);

    } else {
      // Add new item
      form.setValue("items", [...items, newItem], { shouldValidate: true, shouldDirty: true });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const items = form.getValues("items");
    const index = items.findIndex((item) => item.productId === productId);
    if (index === -1) return;
    form.setValue(`items.${index}.quantity`, quantity, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeItem = (productId: string) => {
    const items = form.getValues("items");
    const updatedItems = items.filter((item) => item.productId !== productId);
    form.setValue("items", updatedItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };


  const watchedItems = useWatch({ control: form.control, name: "items" });

  const totalQuantity = useMemo(() => {
    const items = form.getValues("items");
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [watchedItems]);


  return (
    <PurchaseOrderContext.Provider value={{ state, form, totalQuantity, addItem, changeActiveStep, updateQuantity, removeItem }}>
      <FormProvider {...form}>{children}</FormProvider>
    </PurchaseOrderContext.Provider>
  );
};

export const usePurchaseOrder = () => {
  const ctx = useContext(PurchaseOrderContext);
  if (!ctx) throw new Error('usePurchaseOrder must be used within a PurchaseOrderProvider');
  return ctx;
};