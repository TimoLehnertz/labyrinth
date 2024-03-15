import { NextRequest, NextResponse } from "next/server";

export abstract class Endpoint<T, V> {
  constructor() {}

  abstract handle(request: NextRequest): Promise<NextResponse<V>>;

  abstract send(data: T): Promise<V>;
}
