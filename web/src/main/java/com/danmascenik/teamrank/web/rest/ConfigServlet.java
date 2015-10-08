package com.danmascenik.teamrank.web.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.stereotype.Component;

import com.danmascenik.teamrank.web.rest.api.ConfigJSON;

@Component
@Path("/config")
public class ConfigServlet {

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public ConfigJSON getConfig() throws Exception {

    return new ConfigJSON();
  }


}
