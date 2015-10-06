package com.danmascenik.teamrank.web.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.stereotype.Component;

import com.danmascenik.teamrank.web.rest.api.MemberJSON;

@Component
@Path("/member")
public class MemberServlet {

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public MemberJSON createMember(@FormDataParam("name") String name, @FormDataParam("email") String email) {

    throw new RuntimeException("not implemented");
  }

  @POST
  @Path("email")
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public Response emailExists(@FormDataParam("email") String email) {

    throw new RuntimeException("not implemented");
  }

  @POST
  @Path("{memberId}")
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public MemberJSON updateMember(
      @PathParam("memberId") String memberId,
      @FormDataParam("name") String name,
      @FormDataParam("email") String email) {

    throw new RuntimeException("not implemented");
  }

  @GET
  @Path("{memberId}")
  @Produces(MediaType.APPLICATION_JSON)
  public MemberJSON getMember(@PathParam("memberId") String memberId) throws Exception {

    throw new RuntimeException("not implemented");
  }

  @DELETE
  @Path("{memberId}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteMember(@PathParam("memberId") String memberId) throws Exception {

    throw new RuntimeException("not implemented");
  }

  @GET
  @Path("{voterId}/vote/{targetId}")
  @Produces(MediaType.APPLICATION_JSON)
  public MemberJSON castVote(@PathParam("voterId") String voterId, @PathParam("targetId") String targetId)
      throws Exception {

    throw new RuntimeException("not implemented");
  }

}
