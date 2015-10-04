package com.danmascenik.teamrank.rest.api;

import java.util.ArrayList;
import java.util.List;

public class MemberJSON {

  private String uuid;
  private String name;
  private String email;
  private List<String> votes = new ArrayList<String>();

  public MemberJSON(String uuid, String name, String email, List<String> votes) {
    super();
    this.uuid = uuid;
    this.name = name;
    this.email = email;
    this.votes.addAll(votes);
  }

  public String getUuid() {
    return uuid;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public List<String> getVotes() {
    return votes;
  }

}
