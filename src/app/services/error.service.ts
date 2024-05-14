import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class handleErrorService {

    constructor(
        private readonly toastr: ToastrService
    ) { }

    handleError(err: HttpErrorResponse): void {
        this.toastr.error(err.error.message)
    }
}