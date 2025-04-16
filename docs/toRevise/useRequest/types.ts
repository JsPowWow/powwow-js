import {CancelToken} from "axios";

export type RequestType = ({cancelToken}: {cancelToken: CancelToken}) => Promise<void>;
