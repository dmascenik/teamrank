package com.danmascenik.teamrank.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.stereotype.Component;

import com.danmascenik.teamrank.rest.api.AboutJSON;

@Component
@Path("/about")
public class AboutServlet {

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public AboutJSON getAboutInfo() throws Exception {

    return new AboutJSON("1.0");
  }


}
