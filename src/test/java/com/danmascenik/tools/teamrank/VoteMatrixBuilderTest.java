package com.danmascenik.tools.teamrank;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

import com.danmascenik.tools.teamrank.VoteMatrix.Builder;
import com.google.common.collect.Sets;

public class VoteMatrixBuilderTest {

  @Test
  public void testCreateMatrix() {
    Set<String> names = Sets.newHashSet("a", "b", "c", "d");
    Builder<String> b = new Builder<String>(names);
    b.castVote("a", "b");
    VoteMatrix<String> v = b.build();
    assertNotNull(v);
    Set<String> votes = v.getVotes("a");
    assertNotNull(votes);
    assertEquals(1, votes.size());
    assertTrue(votes.contains("b"));
    Set<String> voters = v.getVoters("b");
    assertNotNull(voters);
    assertEquals(1, voters.size());
    assertTrue(voters.contains("a"));
    assertEquals(1.0f, v.valueAt("a", "b"), 0);
    assertEquals(0.0f, v.valueAt("b", "a"), 0);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testCreateZeroByZeroMatrix() {
    Set<String> names = new HashSet<String>();
    new Builder<String>(names);
  }

  @Test(expected = NullPointerException.class)
  public void testCreateMatrixNullSet() {
    new Builder<String>(null);
  }

  @Test
  public void testCastMultiVotes() {
    Set<String> names = Sets.newHashSet("a", "b", "c", "d");
    Builder<String> b = new Builder<String>(names);
    b.castVotes("a", Sets.newHashSet("b", "c", "d"));
    VoteMatrix<String> v = b.build();
    Set<String> votes = v.getVotes("a");
    assertEquals(3, votes.size());
    assertTrue(votes.contains("b"));
    assertTrue(votes.contains("c"));
    assertTrue(votes.contains("d"));
  }

  @Test(expected = IllegalArgumentException.class)
  public void testGetInvalidVoter() {
    Set<String> names = Sets.newHashSet("a", "b", "c", "d");
    Builder<String> b = new Builder<String>(names);
    b.castVote("nobody", "a");
  }

  @Test
  public void testBuildTwice() {
    Set<String> names = Sets.newHashSet("a", "b", "c", "d");
    Builder<String> b = new Builder<String>(names);
    b.castVote("a", "b");
    b.build();
    try {
      b.build();
      fail("Should not have been able to build the matrix twice");
    } catch (IllegalStateException e) {}
  }

  @Test
  public void testVoteAfterBuild() {
    Set<String> names = Sets.newHashSet("a", "b", "c", "d");
    Builder<String> b = new Builder<String>(names);
    b.castVote("a", "b");
    b.build();
    try {
      b.castVote("b", "c");
      fail("Should not have been able to vote after building matrix");
    } catch (IllegalStateException e) {}
  }

  @Test
  public void testBuildNoVotes() {
    Set<String> names = Sets.newHashSet("a", "b", "c", "d");
    Builder<String> b = new Builder<String>(names);
    try {
      b.build();
      fail("Should not have been able to build matrix with no votes");
    } catch (IllegalStateException e) {}
  }

}
