package com.danmascenik.teamrank.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.stereotype.Component;

import com.danmascenik.teamrank.rest.api.MemberJSON;

@Component
@Path("/member")
public class MemberServlet {

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public MemberJSON createMember(@FormDataParam("name") String name, @FormDataParam("email") String email) {

    throw new RuntimeException("not implemented");
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public MemberJSON getMember() throws Exception {

    throw new RuntimeException("not implemented");
  }

}
