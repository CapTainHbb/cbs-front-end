// src/hooks/useBillingFilters.ts
import { useDispatch, useSelector } from "react-redux";
import {resetFilters, setFilter} from "../../../../slices/billingFilters/reducer";

export const useBillingFilters = () => {
    const filters = useSelector((state: any) => state.BillingFilters);

    const dispatch = useDispatch();

    const updateFilter = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
        // @ts-ignore
        dispatch(setFilter({ key, value }));
    };

    return {
        filters,
        updateFilter,
        resetFilters: () => dispatch(resetFilters()),
    };
};
