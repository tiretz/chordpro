from fastapi import Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.exceptions import BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException


class ExceptionHandlerMiddleware(BaseHTTPMiddleware):
    """Exception middleware"""

    async def dispatch(self, request: Request, call_next):

        try:
            return await call_next(request)

        except BadRequestException as bre:
            return self.__create_error_response(status.HTTP_400_BAD_REQUEST, "Bad Request", str(bre))

        except ConflictException as ce:
            return self.__create_error_response(status.HTTP_409_CONFLICT, "Conflict", str(ce))

        except UnauthorizedException as ue:
            return self.__create_error_response(status.HTTP_401_UNAUTHORIZED, "Unauthorized", str(ue))

        except ForbiddenException as fe:
            return self.__create_error_response(status.HTTP_403_FORBIDDEN, "Forbidden", str(fe))

        except NotFoundException as nf:
            return self.__create_error_response(status.HTTP_404_NOT_FOUND, "Not Found", str(nf))

        except InternalServerErrorException as ie:
            return self.__create_error_response(status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal Server Error", str(ie))

        except HTTPException as he:
            return self.__create_error_response(he.status_code, "Client Error", str(he.detail))

        except Exception as e:
            return self.__create_error_response(status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal Server Error", str(e))

    def __create_error_response(self, status_code: int, error: str, message: str) -> JSONResponse:

        return JSONResponse(
            status_code=status_code,
            content=jsonable_encoder({"status": status_code, "error": error, "message": message}),
        )
