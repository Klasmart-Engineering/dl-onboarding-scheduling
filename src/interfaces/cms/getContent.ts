import { ContentType } from "../../types";
import { Uuid } from "../../utils";

import { BaseRequest } from "./base";

export interface GetContentRequest extends BaseRequest {
    content_id: Uuid;
}

// Too many fields, only implement the necessary fields
export interface GetContentResponse {
    id: Uuid;
    content_type: ContentType;
    content_type_name: string;
    program: Uuid;
    program_name: string;
    subject: Uuid[];
    subject_name: string[];
}