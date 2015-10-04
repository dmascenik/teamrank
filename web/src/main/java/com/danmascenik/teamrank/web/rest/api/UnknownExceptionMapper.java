package com.danmascenik.teamrank.web.rest.api;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.springframework.stereotype.Repository;

/**
 * Provide more specific exceptions by implementing {@link ExceptionMapper}s with more specific generics. This
 * package is scanned for {@link ExceptionMapper}s with the class annotations below.<br/>
 * <br/>
 * This {@link ExceptionMapper} provides a default message for any exception not handled by another, more
 * specific mapper.
 *
 * @author Dan Mascenik
 */
@Repository
@Provider
public class UnknownExceptionMapper implements ExceptionMapper<Exception> {

  @Override
  public Response toResponse(Exception exception) {
    ExceptionJSON e = new ExceptionJSON();
    e.setErrMsg("An unknown error occurred");
    return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).type(MediaType.APPLICATION_JSON).build();
  }

}
